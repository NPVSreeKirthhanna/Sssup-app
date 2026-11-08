import streamlit as st
import streamlit.components.v1 as components
import os

# Set page title and layout
st.set_page_config(
    page_title="Ssupp - Encrypted Messaging & Calls",
    page_icon="💬",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Hide Streamlit Chrome for clean full-screen experience
st.markdown("""
<style>
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    div[data-testid="stAppViewContainer"] {
        padding: 0 !important;
        margin: 0 !important;
    }
    .block-container {
        padding: 0rem !important;
        max-width: 100% !important;
    }
    iframe {
        width: 100% !important;
        height: 98vh !important;
        border: none !important;
    }
</style>
""", stroke_width=0, unsafe_allow_html=True)

# Build dist directory check
dist_index = os.path.join(os.path.dirname(__file__), "dist", "index.html")

if os.path.exists(dist_index):
    with open(dist_index, "r", encoding="utf-8") as f:
        html_content = f.read()
    components.html(html_content, height=900, scrolling=True)
else:
    st.title("💬 Ssupp Web App")
    st.success("Ssupp full-stack application is ready!")
    st.write("Ssupp is built with React, Vite & Node.js. For full native performance, E2EE, and WebRTC video calls, host on Vercel, Netlify, or Render.")
