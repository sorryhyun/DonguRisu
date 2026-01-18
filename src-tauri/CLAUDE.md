# Tauri Desktop Backend (`/src-tauri`)

This directory contains the Tauri 2.x Rust backend for the desktop application (Windows, macOS, Linux).

## Directory Structure

| Path | Purpose |
|------|---------|
| `src/main.rs` | Rust backend with Tauri commands |
| `Cargo.toml` | Rust dependencies |
| `tauri.conf.json` | Tauri configuration |
| `capabilities/` | Tauri v2 permission capabilities |
| `icons/` | Application icons |
| `src-python/` | Bundled Python scripts (for local AI) |

## Configuration (`tauri.conf.json`)

Key settings:
- **Product**: DonguRisu
- **Identifier**: `com.sorryhyun.dongurisu`
- **Dev URL**: `http://localhost:5174`
- **File associations**: `.risum`, `.risup`, `.charx`
- **Deep link scheme**: `dongurisulocal://`

## Build Targets

```json
"targets": ["deb", "rpm", "appimage", "nsis", "app", "dmg"]
```

| Target | Platform |
|--------|----------|
| `nsis` | Windows installer |
| `app`, `dmg` | macOS |
| `deb`, `rpm`, `appimage` | Linux |

## Tauri Commands (`main.rs`)

### HTTP/Networking

| Command | Purpose |
|---------|---------|
| `native_request` | HTTP request bypassing CORS |
| `streamed_fetch` | Streaming HTTP with chunked response via events |

### OAuth

| Command | Purpose |
|---------|---------|
| `oauth_login` | OAuth2 PKCE flow with deep link callback |

### Python Integration

| Command | Purpose |
|---------|---------|
| `install_python` | Download/extract embedded Python |
| `install_pip` | Bootstrap pip |
| `install_py_dependencies` | Install Python packages |
| `run_py_server` | Start local Python AI server |
| `check_requirements_local` | Verify Python/Git installed |

### Utilities

| Command | Purpose |
|---------|---------|
| `check_auth` | Verify file-based authentication |
| `greet` | Test command |

## Tauri Plugins

```rust
.plugin(tauri_plugin_http::init())
.plugin(tauri_plugin_deep_link::init())
.plugin(tauri_plugin_shell::init())
.plugin(tauri_plugin_process::init())
.plugin(tauri_plugin_updater::Builder::new().build())
.plugin(tauri_plugin_dialog::init())
.plugin(tauri_plugin_os::init())
.plugin(tauri_plugin_fs::init())
.plugin(tauri_plugin_single_instance::init(...))  // Desktop only
```

## Event System

| Event | Direction | Purpose |
|-------|-----------|---------|
| `streamed_fetch` | Rust → JS | Streaming HTTP chunks |
| `oauth_open_url` | Rust → JS | Open OAuth URL |
| `oauth_callback_event` | JS → Rust | OAuth callback code |

## Development

```bash
# Development with hot reload
pnpm tauri dev

# Production build
pnpm tauribuild && pnpm tauri build
```

## Security

- Asset protocol scoped to `$APPDATA` and `/data/**/*`
- CSP disabled (null) - app handles security
- Single instance enforcement on desktop

## Dependencies

Key Rust crates:
- `tauri` 2.9.5 - Core framework
- `reqwest` - HTTP client
- `oauth2` - OAuth implementation
- `tiktoken-rs` - Token counting
- `zip`, `tar` - Archive handling
- `eventsource-client` - SSE support

## Related Documentation

- [Root CLAUDE.md](../CLAUDE.md) - Project overview
- [TypeScript CLAUDE.md](../src/ts/CLAUDE.md) - Frontend code
