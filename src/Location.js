import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    PermissionsAndroid,
    Platform,
    Alert,
    TouchableOpacity,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const LocationScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const locationPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };

    const getAddress = async (latitude, longitude) => {
        if (!name || !email ) {
            Alert.alert( 'All fields are required.');
            return;
          }
        const API_KEY = '';  //this repleace your api key
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`
            );
            const data = await response.json();
            //   console.log("data",data);
            const getAddress = data.results[0]?.formatted_address || 'No Address';
            setAddress(getAddress);
            return getAddress;
        } catch (error) {
            Alert.alert('Error', 'not  to fetch address. Please try again.');
        }
    };

    const getLocation = async () => {
        const hasPermission = await locationPermission();
        if (!hasPermission) {
            Alert.alert('Location permission is required');
            return;
        }
        setIsLoading(true);
        Geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                // console.log("latitude, longitude",latitude, longitude);
                setLocation({ latitude, longitude });
                await getAddress(latitude, longitude);
                setIsLoading(false);
            },
            (error) => {
                Alert.alert('Error', 'not access get location. Please try again.');
                setIsLoading(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

  
    return (
        <View style={styles.container}>
            <Text style={styles.title}> Form details</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={getLocation}
                disabled={isLoading}
            >
                <Text style={styles.buttonText}>
                    {isLoading ? 'Fetching Location...' : 'Get Location'}
                </Text>
            </TouchableOpacity>
            {location && (
                <Text style={styles.text}>
                    Location: Latitude {location.latitude}, Longitude {location.longitude}
                </Text>
            )}
            {address && <Text style={styles.text}>Address: {address}</Text>}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 16,
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LocationScreen;