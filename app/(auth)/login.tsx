import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Building2, ShieldCheck, User, Lock, Mail, ArrowRight } from 'lucide-react-native';

const isOfficialAccount = (email: string) => {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;
  return (
    /@(?:[a-z0-9-]+\.)*(?:gov(?:\.in)?|municipal|municipality|authority|official)(?:\.[a-z]{2,})?$/i.test(normalized) ||
    /^(official|authority|municipality|admin)[.@]/i.test(normalized) ||
    /(official|authority|municipality|admin)/i.test(normalized.split('@')[0])
  );
};

export default function AuthScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ portal?: string }>();
  const portal = params.portal === 'authority' ? 'Authority' : 'Citizen';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const destination = useMemo(
    () => (portal === 'Authority' ? '/(government)/home' : '/(citizen)/home'),
    [portal]
  );

  const handleLogin = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    let displayName = 'Official Admin';

    // -----------------------------------------
    // AUTHORITY LOGIN LOGIC & PROTECTION
    // -----------------------------------------
    if (portal === 'Authority') {
      const isTestAdmin = trimmedEmail === 'admin@hmc.gov' && trimmedPassword === 'admin123';

      if (!isTestAdmin && !isOfficialAccount(trimmedEmail)) {
        setErrorMessage('Access denied: Restricted to verified official accounts.');
        return;
      }
      if (!isTestAdmin && trimmedPassword.length < 6) {
        setErrorMessage('Official password is invalid.');
        return;
      }
      
      // Format Gov Name
      if (!isTestAdmin) {
        const namePart = trimmedEmail.split('@')[0];
        displayName = namePart.split(/[\.\-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
      
    } else {
      // -----------------------------------------
      // CITIZEN DYNAMIC LOGIN & REGISTRATION
      // -----------------------------------------
      if (trimmedPassword.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }

      try {
        // Fetch existing users database
        const usersJson = await AsyncStorage.getItem('@app_users');
        const users = usersJson ? JSON.parse(usersJson) : {};

        if (users[trimmedEmail]) {
          // Account exists: Verify Password
          if (users[trimmedEmail].password !== trimmedPassword) {
            setErrorMessage('Incorrect password for this account.');
            return;
          }
        } else {
          // New Account: Register them
          users[trimmedEmail] = { password: trimmedPassword };
          await AsyncStorage.setItem('@app_users', JSON.stringify(users));
        }

        // Generate a display name dynamically from their email prefix
        const namePart = trimmedEmail.split('@')[0];
        displayName = namePart.split(/[\.\-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

      } catch (error) {
        console.error("Auth Error:", error);
        setErrorMessage('An error occurred during authentication.');
        return;
      }
    }

    setErrorMessage('');

    // Save the global session data so the Profile screen can read it!
    const sessionData = {
      email: trimmedEmail,
      name: displayName,
      role: portal === 'Authority' ? 'official' : 'citizen'
    };
    
    await AsyncStorage.setItem('@app_current_session', JSON.stringify(sessionData));
    await AsyncStorage.setItem('@app_user_role', sessionData.role);
    
    // --> THIS IS THE FIX: Setting the token required by the new strict layout
    await AsyncStorage.setItem('@app_user_token', 'dummy-auth-token-123'); 
    
    router.replace(destination as any);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1B1E' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 28, justifyContent: 'center' }}>
          
          <View style={{ alignItems: 'center', marginBottom: 26 }}>
            <View style={{
                width: 84, height: 84, borderRadius: 24, backgroundColor: '#16262A', borderWidth: 1,
                borderColor: portal === 'Authority' ? '#2F9E8F' : '#E8A33D', alignItems: 'center',
                justifyContent: 'center', shadowColor: portal === 'Authority' ? '#2F9E8F' : '#E8A33D',
                shadowOpacity: 0.2, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, marginBottom: 16,
              }}>
              {portal === 'Authority' ? <ShieldCheck size={38} color="#2F9E8F" /> : <User size={38} color="#E8A33D" />}
            </View>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#F2EFE9', marginBottom: 6 }}>{portal} Portal</Text>
            <Text style={{ fontSize: 14, color: '#9BA8A6', textAlign: 'center', lineHeight: 20 }}>
              {portal === 'Citizen' ? 'Sign in or register a new civic account.' : 'Sign in to your civic workspace.'}
            </Text>
          </View>

          <View style={{ backgroundColor: '#16262A', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#1D3238' }}>
            <View style={{ marginBottom: 18 }}>
              <Text style={{ color: '#9BA8A6', fontSize: 11, letterSpacing: 1, marginBottom: 8, fontWeight: '700' }}>{portal.toUpperCase()} ACCOUNT</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F1B1E', borderRadius: 12, borderWidth: 1, borderColor: '#1D3238', paddingHorizontal: 12, paddingVertical: 12 }}>
                <Mail size={18} color="#9BA8A6" style={{ marginRight: 10 }} />
                <TextInput
                  value={email}
                  onChangeText={(val) => { setEmail(val); setErrorMessage(''); }}
                  placeholder={portal === 'Authority' ? 'admin@hmc.gov' : 'Email address'}
                  placeholderTextColor="#4A5553"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{ flex: 1, color: '#F2EFE9', fontSize: 15 }}
                />
              </View>
            </View>

            <View style={{ marginBottom: 22 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F1B1E', borderRadius: 12, borderWidth: 1, borderColor: '#1D3238', paddingHorizontal: 12, paddingVertical: 12 }}>
                <Lock size={18} color="#9BA8A6" style={{ marginRight: 10 }} />
                <TextInput
                  value={password}
                  onChangeText={(val) => { setPassword(val); setErrorMessage(''); }}
                  placeholder={portal === 'Authority' ? 'Official password' : 'Password'}
                  placeholderTextColor="#4A5553"
                  secureTextEntry
                  style={{ flex: 1, color: '#F2EFE9', fontSize: 15 }}
                />
              </View>
            </View>

            {errorMessage ? <Text style={{ color: '#FFB4B4', fontSize: 12, marginBottom: 12, textAlign: 'center' }}>{errorMessage}</Text> : null}

            <TouchableOpacity onPress={handleLogin} style={{ backgroundColor: portal === 'Authority' ? '#2F9E8F' : '#E8A33D', borderRadius: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Text style={{ color: '#0F1B1E', fontSize: 16, fontWeight: '800', marginRight: 8 }}>Sign in</Text>
              <ArrowRight size={18} color="#0F1B1E" />
            </TouchableOpacity>

            {portal === 'Authority' && (
              <Text style={{ color: '#2F9E8F', fontSize: 12, textAlign: 'center', marginTop: 16, fontWeight: '600' }}>
                Test Login: admin@hmc.gov / admin123
              </Text>
            )}
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}