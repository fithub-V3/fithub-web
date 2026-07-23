import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Image } from "react-native";
import { Link, useRouter } from "expo-router";
import { login } from "@/lib/api-client";
import * as SecureStore from "expo-secure-store";

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit() {
        setError(null);
        setIsSubmitting(true);

        try {
            const { accessToken, refreshToken } = await login({ email, password });
            await SecureStore.setItemAsync("accessToken", accessToken);
            await SecureStore.setItemAsync("refreshToken", refreshToken);
            router.push("/(tabs)");
        } catch {
            setError("Invalid email or password.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <View style={styles.container}>
            <View>
                <View>
                    <Image></Image>
                    <Text style={styles.brandTitle}>Fithub</Text>
                </View>
                <Text style={styles.headerText}>Welcome back</Text>
                <Text style={styles.headerSubText}>Log in to pick up where you left off.</Text>
            </View>
            <View>

                <Text style={styles.inputLabel}>EMAIL</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#6a746f"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />

                <Text style={styles.inputLabel}>PASSWORD</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#6a746f"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />

                <Pressable style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
                    <Text style={styles.submitButtonText}>{isSubmitting ? "Creating account..." : "Log in"}</Text>
                </Pressable>  
                
                <Pressable style={styles.googleButton} disabled={isSubmitting}>
                    <Text style={styles.googleButtonText}>Continue with Google</Text>
                </Pressable>  
                              

            </View>
            <View>
                <View>
                    <Text style={styles.loginText}>New here?</Text>
                    <Link style={styles.loginLink} href="/register">Create an account</Link>
                </View>
            </View>            
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 24 },
    brandTitle: { fontSize: 25, fontWeight: 600, letterSpacing: -.02, color: "#fff", marginBottom: 40},
    headerText: { margin: 0, marginBottom: 6, fontSize: 30, color: "#fff", fontWeight: 500, letterSpacing: -.02 },
    headerSubText: { color: "#98a39e", fontSize: 18, margin: 0, marginBottom: 20},
    input: { backgroundColor: "#131917", borderRadius: 11, borderColor: "rgba(255,255,255,.1)", borderWidth: 1.5, padding: 20, fontSize: 17, color: "#6a746f" },
    inputLabel: { color: "#6a746f", fontSize: 15, marginBottom: 10, marginTop: 20},
    submitButton: { backgroundColor: "#34d17e", color: "#07140d", borderRadius: 12, padding: 20, marginTop: 30},
    submitButtonText: { fontWeight: 700, fontSize: 20, textAlign: "center" } ,
    disclaimer: { color: "#6a746f", fontSize: 14, textAlign: "center", marginTop: 20 },
    loginText: { color: "#98a39e", textAlign: "center", fontSize: 15, marginTop: 16 },
    loginLink: { color: "#34d17e", textAlign: "center", marginTop: 15, fontWeight: 600},
    googleButton: { backgroundColor: "#131917", color: "#07140d", borderRadius: 12, padding: 20, marginTop: 30, borderWidth: 1.5, borderColor: "rgba(255,255,255,0.1)"},
    googleButtonText: { color: "#fff", fontWeight: 700, fontSize: 20, textAlign: "center" }
});
