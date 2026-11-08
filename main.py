import streamlit as st
import base64
import json
import time
from datetime import datetime

# Streamlit Page Setup
st.set_page_config(
    page_title="Ssupp - Encrypted Messaging & Calls",
    page_icon="💬",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- AVATAR LIBRARY (12 CUTE SVG FACES) ---
SVG_CARDS = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#fe4a49"/><circle cx="24" cy="24" r="18" fill="#2b2d42"/><circle cx="76" cy="24" r="18" fill="#2b2d42"/><circle cx="50" cy="56" r="32" fill="#2b2d42"/><ellipse cx="50" cy="62" rx="22" ry="18" fill="#fde2e4"/><ellipse cx="42" cy="54" rx="3" ry="6" fill="#2b2d42"/><ellipse cx="58" cy="54" rx="3" ry="6" fill="#2b2d42"/><circle cx="43" cy="52" r="1" fill="#fff"/><circle cx="59" cy="52" r="1" fill="#fff"/><ellipse cx="50" cy="62" rx="4" ry="2.5" fill="#2b2d42"/><path d="M 44 68 Q 50 74 56 68" stroke="#2b2d42" stroke-width="2" fill="none"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#2a9d8f"/><polygon points="26,45 16,10 36,32" fill="#e9c46a"/><polygon points="74,45 84,10 64,32" fill="#e9c46a"/><circle cx="50" cy="54" r="34" fill="#e9c46a"/><circle cx="36" cy="50" r="5" fill="#264653"/><circle cx="64" cy="50" r="5" fill="#264653"/><circle cx="28" cy="60" r="6" fill="#e76f51"/><circle cx="72" cy="60" r="6" fill="#e76f51"/><path d="M 44 60 Q 50 67 56 60 Z" fill="#e76f51"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#3a86ff"/><circle cx="50" cy="50" r="32" fill="#ffdbac"/><path d="M 22 42 C 20 20, 80 20, 78 42 Z" fill="#5c3d2e"/><path d="M 22 40 C 35 48, 65 48, 78 40 C 82 58, 18 58, 22 40 Z" fill="#ff0054"/><ellipse cx="38" cy="48" rx="7" ry="5" fill="#fff"/><ellipse cx="62" cy="48" rx="7" ry="5" fill="#fff"/><circle cx="38" cy="48" r="3" fill="#212529"/><circle cx="62" cy="48" r="3" fill="#212529"/><path d="M 42 66 Q 50 74 58 66" stroke="#5c3d2e" stroke-width="2.5" fill="none"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#ffb703"/><circle cx="26" cy="26" r="14" fill="#8b5e3c"/><circle cx="74" cy="26" r="14" fill="#8b5e3c"/><circle cx="50" cy="54" r="34" fill="#8b5e3c"/><ellipse cx="50" cy="62" rx="16" ry="12" fill="#faedcd"/><ellipse cx="50" cy="57" rx="5" ry="3.5" fill="#4a2e18"/><circle cx="36" cy="50" r="4" fill="#4a2e18"/><circle cx="64" cy="50" r="4" fill="#4a2e18"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#7209b7"/><ellipse cx="50" cy="56" rx="34" ry="30" fill="#4895ef"/><ellipse cx="36" cy="52" rx="11" ry="13" fill="#bde0fe"/><ellipse cx="64" cy="52" rx="11" ry="13" fill="#bde0fe"/><ellipse cx="37" cy="53" rx="6" ry="8" fill="#03045e"/><ellipse cx="63" cy="53" rx="6" ry="8" fill="#03045e"/><ellipse cx="50" cy="61" rx="5" ry="3.5" fill="#f72585"/><path d="M 42 67 Q 50 74 58 67" stroke="#03045e" stroke-width="2" fill="none"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#f72585"/><circle cx="50" cy="54" r="34" fill="#ffb703"/><circle cx="50" cy="52" r="28" fill="#ffe5ec"/><path d="M 34 26 L 40 36 L 50 22 L 60 36 L 66 26 L 64 40 L 36 40 Z" fill="#ffd166"/><ellipse cx="40" cy="52" rx="3.5" ry="5" fill="#3a86ff"/><ellipse cx="60" cy="52" rx="3.5" ry="5" fill="#3a86ff"/><circle cx="34" cy="58" r="4" fill="#ff85a1" opacity="0.6"/><circle cx="66" cy="58" r="4" fill="#ff85a1" opacity="0.6"/><path d="M 45 61 Q 50 66 55 61" stroke="#ef476f" stroke-width="2" fill="none"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#4cc9f0"/><polygon points="20,40 16,14 40,26" fill="#fff"/><polygon points="80,40 84,14 60,26" fill="#fff"/><ellipse cx="50" cy="56" rx="34" ry="28" fill="#fff"/><ellipse cx="36" cy="52" rx="4" ry="6" fill="#2b2d42"/><ellipse cx="64" cy="52" rx="4" ry="6" fill="#2b2d42"/><ellipse cx="50" cy="58" rx="3.5" ry="2.5" fill="#ffb703"/><line x1="16" y1="52" x2="28" y2="54" stroke="#2b2d42" stroke-width="2"/><line x1="84" y1="52" x2="72" y2="54" stroke="#2b2d42" stroke-width="2"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#b5e2fa"/><ellipse cx="36" cy="24" rx="8" ry="22" fill="#fff"/><ellipse cx="64" cy="24" rx="8" ry="22" fill="#fff"/><circle cx="50" cy="58" r="30" fill="#fff"/><ellipse cx="38" cy="54" rx="3.5" ry="5.5" fill="#2b2d42"/><ellipse cx="62" cy="54" rx="3.5" ry="5.5" fill="#2b2d42"/><polygon points="50,60 46,57 54,57" fill="#ffb5a7"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#0077b6"/><circle cx="50" cy="54" r="30" fill="#fff"/><path d="M 30 34 L 70 34 L 64 22 L 36 22 Z" fill="#023e8a"/><ellipse cx="50" cy="64" rx="16" ry="10" fill="#ffb703"/><ellipse cx="40" cy="50" rx="4" ry="7" fill="#023e8a"/><ellipse cx="60" cy="50" rx="4" ry="7" fill="#023e8a"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#ff0054"/><circle cx="50" cy="52" r="34" fill="#1d3557"/><ellipse cx="50" cy="56" rx="26" ry="24" fill="#fff"/><ellipse cx="40" cy="50" rx="4" ry="6" fill="#1d3557"/><ellipse cx="60" cy="50" rx="4" ry="6" fill="#1d3557"/><polygon points="50,55 42,62 58,62" fill="#ff9e00"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#52b788"/><polygon points="34,26 28,14 40,22" fill="#ffb703"/><polygon points="66,26 72,14 60,22" fill="#ffb703"/><circle cx="50" cy="54" r="32" fill="#74c69d"/><ellipse cx="50" cy="64" rx="20" ry="14" fill="#b7e4c7"/><circle cx="38" cy="48" r="5" fill="#1b4332"/><circle cx="62" cy="48" r="5" fill="#1b4332"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#ff70a6"/><polygon points="20,40 16,14 42,28" fill="#f77f00"/><polygon points="80,40 84,14 58,28" fill="#f77f00"/><circle cx="50" cy="54" r="32" fill="#f77f00"/><polygon points="50,76 26,52 74,52" fill="#fff"/><circle cx="50" cy="66" r="3.5" fill="#003049"/><circle cx="36" cy="48" r="4.5" fill="#003049"/><circle cx="64" cy="48" r="4.5" fill="#003049"/></svg>'
]

DEFAULT_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#00a884"/><circle cx="50" cy="38" r="18" fill="#fff" opacity="0.9"/><path d="M 20 84 C 20 62, 36 56, 50 56 C 64 56, 80 62, 80 84 Z" fill="#fff" opacity="0.9"/></svg>'

def svg_to_url(svg_str):
    b64 = base64.b64encode(svg_str.encode('utf-8')).decode('utf-8')
    return f"data:image/svg+xml;base64,{b64}"

AVATAR_URLS = [svg_to_url(s) for s in SVG_CARDS]
DEFAULT_AVATAR_URL = svg_to_url(DEFAULT_SVG)

# --- INITIALIZE SESSION STATE ---
if 'user' not in st.session_state:
    st.session_state['user'] = {
        'username': 'Alex',
        'avatar': AVATAR_URLS[0],
        'save_login': True
    }

if 'logged_in' not in st.session_state:
    st.session_state['logged_in'] = True

if 'theme' not in st.session_state:
    st.session_state['theme'] = 'dark'

if 'contacts' not in st.session_state:
    st.session_state['contacts'] = [
        {
            'username': 'aarav_crypto',
            'saved_name': 'Aarav (Bestie)',
            'avatar': AVATAR_URLS[2],
            'status': 'Online',
            'unread': 0
        },
        {
            'username': 'ananya_design',
            'saved_name': 'Ananya (Work)',
            'avatar': AVATAR_URLS[5],
            'status': 'Typing...',
            'unread': 1
        },
        {
            'username': 'rohan_dev',
            'saved_name': 'Rohan Developer',
            'avatar': AVATAR_URLS[1],
            'status': 'Offline',
            'unread': 0
        }
    ]

if 'active_contact' not in st.session_state:
    st.session_state['active_contact'] = 'aarav_crypto'

if 'chats' not in st.session_state:
    st.session_state['chats'] = {
        'aarav_crypto': [
            {'sender': 'aarav_crypto', 'text': 'Hey Alex! Did you set up end-to-end encryption?', 'time': '10:14 AM', 'type': 'text'},
            {'sender': 'Alex', 'text': 'Yes! All Ssupp messages are encrypted with RSA-OAEP keys 🔐', 'time': '10:15 AM', 'type': 'text'},
            {'sender': 'aarav_crypto', 'text': 'Awesome! Check out this cute sticker ✨', 'time': '10:16 AM', 'type': 'sticker', 'sticker': AVATAR_URLS[7]}
        ],
        'ananya_design': [
            {'sender': 'ananya_design', 'text': 'Hey Alex, check out the new avatar grid design! 🎨', 'time': '09:40 AM', 'type': 'text'}
        ],
        'rohan_dev': [
            {'sender': 'rohan_dev', 'text': 'Call me whenever you are free for code review.', 'time': 'Yesterday', 'type': 'text'}
        ]
    }

if 'active_call' not in st.session_state:
    st.session_state['active_call'] = None

if 'editing_nickname' not in st.session_state:
    st.session_state['editing_nickname'] = False

# --- THEME STYLING ---
theme_bg = "#111b21" if st.session_state['theme'] == 'dark' else "#f0f2f5"
theme_card = "#1f2c34" if st.session_state['theme'] == 'dark' else "#ffffff"
theme_text = "#e9edef" if st.session_state['theme'] == 'dark' else "#111b21"
theme_accent = "#00a884"

st.markdown(f"""
<style>
    .stApp {{
        background-color: {theme_bg} !important;
        color: {theme_text} !important;
    }}
    .contact-card {{
        background-color: {theme_card};
        padding: 10px 14px;
        border-radius: 14px;
        margin-bottom: 8px;
        border: 1px solid rgba(255, 255, 255, 0.08);
    }}
    .msg-sent {{
        background-color: #005c4b;
        color: #ffffff;
        padding: 10px 14px;
        border-radius: 14px 14px 2px 14px;
        margin-left: auto;
        max-width: 75%;
        margin-bottom: 8px;
    }}
    .msg-rcvd {{
        background-color: {theme_card};
        color: {theme_text};
        padding: 10px 14px;
        border-radius: 14px 14px 14px 2px;
        margin-right: auto;
        max-width: 75%;
        margin-bottom: 8px;
        border: 1px solid rgba(255, 255, 255, 0.05);
    }}
    .avatar-img {{
        width: 44px;
        height: 44px;
        border-radius: 50%;
        object-fit: cover;
    }}
    .header-bar {{
        background-color: {theme_card};
        padding: 12px 20px;
        border-radius: 16px;
        margin-bottom: 15px;
        border: 1px solid rgba(255, 255, 255, 0.08);
    }}
</style>
""", unsafe_allow_html=True)

# --- LOGIN MODAL (IF NOT LOGGED IN) ---
if not st.session_state['logged_in']:
    st.title("💬 Welcome to Ssupp")
    st.subheader("WhatsApp-style Encrypted Chat with Instagram Requests & Avatars")
    
    with st.form("login_form"):
        username_input = st.text_input("Choose Username (@username)", value="Alex")
        save_info = st.checkbox("Save Login Info? (Auto-login on future visits)", value=True)
        st.write("**Choose DP Avatar (12 Cute Cartoon Face Cards):**")
        
        cols = st.columns(6)
        chosen_avatar = st.session_state['user']['avatar']
        for idx, url in enumerate(AVATAR_URLS):
            with cols[idx % 6]:
                st.image(url, width=50)
                if st.form_submit_button(f"Pick #{idx+1}"):
                    chosen_avatar = url
        
        submit_btn = st.form_submit_button("Start Chatting 🚀")
        if submit_btn:
            st.session_state['user'] = {
                'username': username_input,
                'avatar': chosen_avatar,
                'save_login': save_info
            }
            st.session_state['logged_in'] = True
            st.rerun()
    st.stop()

# --- TOP NAVIGATION & BRANDING ---
st.markdown(f"""
<div class="header-bar">
    <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 12px;">
            <img src="{st.session_state['user']['avatar']}" class="avatar-img" />
            <div>
                <strong style="font-size: 18px; color: {theme_accent};">Ssupp</strong>
                <span style="font-size: 12px; color: #8696a0; margin-left: 8px;">@{st.session_state['user']['username']}</span>
            </div>
        </div>
        <div style="font-size: 13px; color: #8696a0;">
            🔒 End-to-End Encrypted (RSA-OAEP 2048-bit)
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# Main 2-Column Layout (Left: Contacts & Requests, Right: Active Chat Window)
col_left, col_right = st.columns([1, 2.2])

# --- LEFT COLUMN: CONTACTS, SEARCH, AVATAR PICKER & REQUESTS ---
with col_left:
    st.subheader("💬 Chats")
    
    # 1. Search Bar
    search_query = st.text_input("🔍 Search contact name or message", placeholder="Type username or message...")
    
    # 2. Instagram-Style Add Friend Request
    with st.expander("➕ Add Friend Request (@username)", expanded=False):
        new_friend_user = st.text_input("Enter friend's username", placeholder="e.g. priya_arts")
        new_friend_nickname = st.text_input("Save Friend As (Custom Name)", placeholder="e.g. Priya Bestie")
        if st.button("Send Friend Request 📤"):
            if new_friend_user:
                st.session_state['contacts'].append({
                    'username': new_friend_user,
                    'saved_name': new_friend_nickname or new_friend_user,
                    'avatar': AVATAR_URLS[3],
                    'status': 'Online',
                    'unread': 0
                })
                st.session_state['chats'][new_friend_user] = [
                    {'sender': 'system', 'text': f'🔒 Encryption keys exchanged with @{new_friend_user}', 'time': 'Just now', 'type': 'text'}
                ]
                st.success(f"Friend request sent to @{new_friend_user}!")
                st.rerun()

    # 3. Avatar Picker in Profile Expander
    with st.expander("👤 My Profile & Change Avatar", expanded=False):
        st.write("**Select Face Card (12 Cute Cartoon Cards):**")
        grid_cols = st.columns(4)
        for idx, url in enumerate(AVATAR_URLS):
            with grid_cols[idx % 4]:
                st.image(url, width=45)
                if st.button(f"Card #{idx+1}", key=f"av_btn_{idx}"):
                    st.session_state['user']['avatar'] = url
                    st.success("DP Avatar updated!")
                    st.rerun()
        
        uploaded_file = st.file_uploader("13. Upload Custom Gallery Photo", type=['png', 'jpg', 'jpeg'])
        if uploaded_file:
            bytes_data = uploaded_file.getvalue()
            b64_img = base64.b64encode(bytes_data).decode()
            st.session_state['user']['avatar'] = f"data:image/jpeg;base64,{b64_img}"
            st.success("Uploaded custom photo DP!")
            st.rerun()
            
        if st.button("🗑️ Delete DP (Reset to Default)"):
            st.session_state['user']['avatar'] = DEFAULT_AVATAR_URL
            st.success("Reset DP to default!")
            st.rerun()

    # 4. Filtered Contact List
    filtered_contacts = []
    for c in st.session_state['contacts']:
        # Filter check
        q = search_query.lower()
        c_name = c['saved_name'].lower()
        c_user = c['username'].lower()
        chat_msgs = st.session_state['chats'].get(c['username'], [])
        last_txt = chat_msgs[-1]['text'].lower() if chat_msgs else ""
        
        if not q or q in c_name or q in c_user or q in last_txt:
            filtered_contacts.append(c)

    for c in filtered_contacts:
        is_active = c['username'] == st.session_state['active_contact']
        border_color = theme_accent if is_active else "rgba(255,255,255,0.08)"
        
        c_cols = st.columns([1, 4])
        with c_cols[0]:
            st.image(c['avatar'], width=45)
        with c_cols[1]:
            if st.button(f"{c['saved_name']} (@{c['username']})", key=f"contact_{c['username']}"):
                st.session_state['active_contact'] = c['username']
                st.rerun()
            st.caption(f"Status: {c['status']}")

    st.divider()
    
    # Theme & Logout Bar
    t_cols = st.columns(2)
    with t_cols[0]:
        if st.button("🌙 Toggle Theme"):
            st.session_state['theme'] = 'light' if st.session_state['theme'] == 'dark' else 'dark'
            st.rerun()
    with t_cols[1]:
        if st.button("🚪 Logout"):
            st.session_state['logged_in'] = False
            st.rerun()

# --- RIGHT COLUMN: ACTIVE CHAT WINDOW & CALL MODAL ---
with col_right:
    active_uname = st.session_state['active_contact']
    active_c = next((c for c in st.session_state['contacts'] if c['username'] == active_uname), None)
    
    if not active_c:
        st.info("Select a contact to start chatting.")
    else:
        # Chat Header
        h_col1, h_col2, h_col3 = st.columns([1, 3, 2])
        with h_col1:
            st.image(active_c['avatar'], width=50)
        with h_col2:
            st.markdown(f"### {active_c['saved_name']}")
            st.caption(f"@{active_c['username']} • {active_c['status']}")
        with h_col3:
            call_cols = st.columns(2)
            with call_cols[0]:
                if st.button("📞 Voice Call"):
                    st.session_state['active_call'] = {'type': 'Voice', 'contact': active_c['saved_name']}
                    st.rerun()
            with call_cols[1]:
                if st.button("📹 Video Call"):
                    st.session_state['active_call'] = {'type': 'Video', 'contact': active_c['saved_name']}
                    st.rerun()

        # Save Friend As / Rename Contact Modal / Expander
        with st.expander("✏️ Save / Edit Friend Nickname", expanded=False):
            new_nick = st.text_input("Enter custom nickname for this friend:", value=active_c['saved_name'])
            if st.button("Save Nickname"):
                active_c['saved_name'] = new_nick
                st.success("Saved contact nickname!")
                st.rerun()

        st.divider()

        # Call Active Modal Overlay Simulation
        if st.session_state['active_call']:
            call_info = st.session_state['active_call']
            st.warning(f"🔔 {call_info['type']} Call in Progress with **{call_info['contact']}**...")
            st.info("🟢 Encrypted WebRTC Connection Established • Audio/Video Connected")
            c_actions = st.columns(3)
            with c_actions[0]:
                st.button("🎙️ Mute Mic")
            with c_actions[1]:
                st.button("📹 Toggle Camera")
            with c_actions[2]:
                if st.button("🔴 End Call"):
                    st.session_state['active_call'] = None
                    st.rerun()
            st.divider()

        # Chat Messages Stream Container
        messages = st.session_state['chats'].get(active_uname, [])
        chat_box = st.container(height=380)
        
        with chat_box:
            for m in messages:
                is_me = m['sender'] == st.session_state['user']['username'] or m['sender'] == 'Alex'
                align_class = "msg-sent" if is_me else "msg-rcvd"
                
                if m['type'] == 'text':
                    st.markdown(f"""
                    <div class="{align_class}">
                        <div>{m['text']}</div>
                        <div style="font-size: 10px; opacity: 0.7; text-align: right; margin-top: 4px;">{m['time']} • 🔒 Encrypted</div>
                    </div>
                    """, unsafe_allow_html=True)
                elif m['type'] == 'sticker':
                    st.markdown(f"**{m['sender']} sent a sticker:**")
                    st.image(m['sticker'], width=100)

        # Message Input Bar
        with st.form("send_msg_form", clear_on_submit=True):
            input_cols = st.columns([4, 1])
            with input_cols[0]:
                msg_input = st.text_input("Type an encrypted message...", placeholder="Type a message...", label_visibility="collapsed")
            with input_cols[1]:
                send_btn = st.form_submit_button("Send ✈️")

            if send_btn and msg_input.strip():
                now_str = datetime.now().strftime("%I:%M %p")
                st.session_state['chats'][active_uname].append({
                    'sender': st.session_state['user']['username'],
                    'text': msg_input,
                    'time': now_str,
                    'type': 'text'
                })
                st.rerun()

        # Attachments & Stickers Bar
        with st.expander("📎 Send Photo / Sticker / Voice Note", expanded=False):
            att_tabs = st.tabs(["🖼️ Send Photo", "✨ Send Sticker", "🎙️ Voice Note"])
            with att_tabs[0]:
                img_file = st.file_uploader("Upload Image", type=['png', 'jpg', 'jpeg'], key="chat_img_upload")
                if img_file and st.button("Send Photo 📤"):
                    b64_img = base64.b64encode(img_file.getvalue()).decode()
                    st.session_state['chats'][active_uname].append({
                        'sender': st.session_state['user']['username'],
                        'text': f"📷 Sent a photo",
                        'time': datetime.now().strftime("%I:%M %p"),
                        'type': 'text'
                    })
                    st.success("Photo sent!")
                    st.rerun()
            with att_tabs[1]:
                st.write("Pick a cute sticker:")
                stk_cols = st.columns(4)
                for s_idx, s_url in enumerate(AVATAR_URLS[:4]):
                    with stk_cols[s_idx]:
                        st.image(s_url, width=60)
                        if st.button(f"Send #{s_idx+1}", key=f"stk_{s_idx}"):
                            st.session_state['chats'][active_uname].append({
                                'sender': st.session_state['user']['username'],
                                'text': 'Sticker',
                                'time': datetime.now().strftime("%I:%M %p"),
                                'type': 'sticker',
                                'sticker': s_url
                            })
                            st.rerun()
            with att_tabs[2]:
                if st.button("🎙️ Send 5s Voice Note"):
                    st.session_state['chats'][active_uname].append({
                        'sender': st.session_state['user']['username'],
                        'text': "🎵 Voice Note (0:05) ▶️ ━━━━━━⚪ 0:05",
                        'time': datetime.now().strftime("%I:%M %p"),
                        'type': 'text'
                    })
                    st.success("Voice Note sent!")
                    st.rerun()
