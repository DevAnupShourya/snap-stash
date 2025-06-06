function getEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`❌ Missing required environment variable: ${name}`);
    }
    return value;
}

export const ENV = {
    SERVER_PORT: parseInt(getEnv("SERVER_PORT")),
    MONGO_URI: getEnv("MONGO_URI"),
    PIN: parseInt(getEnv("AUTH_PIN")),
};
