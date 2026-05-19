# Forza Horizon 6 Voice Swap

Annoyed that the game ties text and voice language together? This Windows tool lets you use a different voice language without changing the text language you normally play with.

The app locates the game's `StringTables` language files, copies the selected source language `.zip`, and overwrites the target language `.zip` that the game will load for voice. Before overwriting anything, it creates a matching `.zip.bak` backup so the original file can be restored from the backup manager.

## Usage

1. Open the app.
2. Select your current in-game language.
3. Select the voice language you want to hear.
4. Click `Execute Swap`.
5. Set the game language to the selected voice target if needed.

The original file is backed up automatically as `.zip.bak`. You can restore or delete backups from the backup manager.

## Build

```bash
npm ci
npx tauri build --no-bundle
```

The executable is created at:

```text
src-tauri/target/release/fh6-voice-swap.exe
```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
