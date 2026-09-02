import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mail, KeyRound, Lock, ArrowRight, ArrowLeft } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  
  // Step 1: 'email', Step 2: 'otp', Step 3: 'reset'
  const [step, setStep] = useState('email'); 
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Check if user exists and "send" OTP
  const handleSendOTP = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) return setErrorMessage('Please enter your email.');

    try {
      const usersJson = await AsyncStorage.getItem('@app_users');
      const users = usersJson ? JSON.parse(usersJson) : {};

      if (!users[trimmedEmail]) {
        return setErrorMessage('No account found with this email.');
      }

      // In a real app, you would call your Node.js/Express API here to send the email.
      // For now, we simulate success and move to the OTP step.
      setErrorMessage('');
      setStep('otp');
      Alert.alert("OTP Sent", "For testing, your OTP is: 1234");
    } catch (error) {
      setErrorMessage('Failed to verify account.');
    }
  };

  // 2. Verify the OTP
  const handleVerifyOTP = () => {
    if (otp === '1234') { // Hardcoded mock OTP
      setErrorMessage('');
      setStep('reset');
    } else {
      setErrorMessage('Invalid OTP. Please try again.');
    }
  };

  // 3. Save the new password
  const handleResetPassword = async () => {
    if (newPassword.length < 6) return setErrorMessage('Password must be at least 6 characters.');

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const usersJson = await AsyncStorage.getItem('@app_users');
      const users = usersJson ? JSON.parse(usersJson) : {};

      // Update the password in storage
      users[trimmedEmail].password = newPassword;
      await AsyncStorage.setItem('@app_users', JSON.stringify(users));

      Alert.alert("Success", "Password updated successfully!");
      router.replace('/(auth)/login');
    } catch (error) {
      setErrorMessage('Failed to reset password.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1B1E' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 40, justifyContent: 'center' }}>
          
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 30 }}>
            <ArrowLeft size={24} color="#9BA8A6" />
          </TouchableOpacity>

          <Text style={{ fontSize: 28, fontWeight: '800', color: '#F2EFE9', marginBottom: 10 }}>
            {step === 'email' ? 'Reset Password' : step === 'otp' ? 'Enter OTP' : 'New Password'}
          </Text>
          <Text style={{ fontSize: 14, color: '#9BA8A6', marginBottom: 30, lineHeight: 20 }}>
            {step === 'email' ? 'Enter your registered email address to receive a verification code.' : 
             step === 'otp' ? `We sent a 4-digit code to ${email}` : 
             'Create a new secure password for your account.'}
          </Text>

          <View style={{ backgroundColor: '#16262A', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#1D3238' }}>
            
            {/* STEP 1: EMAIL INPUT */}
            {step === 'email' && (
              <View style={{ marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F1B1E', borderRadius: 12, borderWidth: 1, borderColor: '#1D3238', paddingHorizontal: 12, paddingVertical: 12 }}>
                  <Mail size={18} color="#9BA8A6" style={{ marginRight: 10 }} />
                  <TextInput
                    value={email}
                    onChangeText={(val) => { setEmail(val); setErrorMessage(''); }}
                    placeholder="Email address"
                    placeholderTextColor="#4A5553"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={{ flex: 1, color: '#F2EFE9', fontSize: 15 }}
                  />
                </View>
              </View>
            )}

            {/* STEP 2: OTP INPUT */}
            {step === 'otp' && (
              <View style={{ marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F1B1E', borderRadius: 12, borderWidth: 1, borderColor: '#1D3238', paddingHorizontal: 12, paddingVertical: 12 }}>
                  <KeyRound size={18} color="#9BA8A6" style={{ marginRight: 10 }} />
                  <TextInput
                    value={otp}
                    onChangeText={(val) => { setOtp(val); setErrorMessage(''); }}
                    placeholder="4-digit OTP (1234)"
                    placeholderTextColor="#4A5553"
                    keyboardType="number-pad"
                    maxLength={4}
                    style={{ flex: 1, color: '#F2EFE9', fontSize: 15 }}
                  />
                </View>
              </View>
            )}

            {/* STEP 3: NEW PASSWORD INPUT */}
            {step === 'reset' && (
              <View style={{ marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F1B1E', borderRadius: 12, borderWidth: 1, borderColor: '#1D3238', paddingHorizontal: 12, paddingVertical: 12 }}>
                  <Lock size={18} color="#9BA8A6" style={{ marginRight: 10 }} />
                  <TextInput
                    value={newPassword}
                    onChangeText={(val) => { setNewPassword(val); setErrorMessage(''); }}
                    placeholder="New Password"
                    placeholderTextColor="#4A5553"
                    secureTextEntry
                    style={{ flex: 1, color: '#F2EFE9', fontSize: 15 }}
                  />
                </View>
              </View>
            )}

            {errorMessage ? <Text style={{ color: '#FFB4B4', fontSize: 12, marginBottom: 12, textAlign: 'center' }}>{errorMessage}</Text> : null}

            <TouchableOpacity 
              onPress={step === 'email' ? handleSendOTP : step === 'otp' ? handleVerifyOTP : handleResetPassword} 
              style={{ backgroundColor: '#2F9E8F', borderRadius: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#0F1B1E', fontSize: 16, fontWeight: '800', marginRight: 8 }}>
                {step === 'email' ? 'Send OTP' : step === 'otp' ? 'Verify Code' : 'Update Password'}
              </Text>
              <ArrowRight size={18} color="#0F1B1E" />
            </TouchableOpacity>

          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}