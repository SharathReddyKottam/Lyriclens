import os
from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain.tools import tool

# Load OPENAI_API_KEY from .env
load_dotenv()

# Debug: print if key is loaded
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    print("ERROR: OPENAI_API_KEY not found in .env")
    exit(1)
else:
    print(f"✓ API key loaded: {api_key[:10]}...")

# ── Define a simple tool ──────────────────────────────────────────────────────
# Tools are plain Python functions. The docstring is what the LLM reads —
# so write it clearly. The @tool decorator registers it with LangChain.

@tool
def add_numbers(a: float, b: float) -> str:
    """Add two numbers together and return the result."""
    return f"The sum of {a} and {b} is {a + b}"


@tool
def greet_user(name: str) -> str:
    """Greet a user by their name."""
    return f"Hello, {name}! Welcome to the Agentic AI System Design course."


# ── Create the agent ──────────────────────────────────────────────────────────
agent = create_agent(
    model="openai:gpt-4o-mini",
    tools=[add_numbers, greet_user],
    system_prompt="You are a helpful assistant. Use the tools available to you.",
)

# ── Run a test query ──────────────────────────────────────────────────────────
result = agent.invoke({
    "messages": [{
        "role": "user",
        "content": "Please greet me — my name is Alex. Also, what is 128 + 256?"
    }]
})

print("\n✅ Setup verified! Agent response:\n")
print(result["messages"][-1].content)

print("\n--- Message trace (shows the ReAct loop steps) ---")
for msg in result["messages"]:
    print(f"  [{type(msg).__name__:15s}] {str(msg.content)[:80]}")