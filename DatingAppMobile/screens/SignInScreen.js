const handleSignIn = async () => {
  try {
    const response = await fetch('http://192.168.1.119:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Logged in:', data.token);
      await AsyncStorage.setItem('token', data.token);
      Toast.show({ type: 'success', text1: 'Login successful!', position: 'bottom' });
      navigation.navigate('Profile');
    } else {
      Toast.show({ type: 'error', text1: 'Login failed', text2: data.error, position: 'bottom' });
    }
  } catch (err) {
    Toast.show({ type: 'error', text1: 'Network error', text2: err.message, position: 'bottom' });
  }
};