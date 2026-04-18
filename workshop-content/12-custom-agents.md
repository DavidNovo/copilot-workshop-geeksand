# Custom Agents

VS Code Prompt:

```
/create-agent Create the following agents:

- An orchestrator agent whos ONLY JOB is to delegate work to the other agents at the correct times 
- A planner agent that takes requirements and creates a plan document from them, split out into sections
- An implementer agent that look at plan file and implements it, one section at a time
- A code review agent that verifies the implement agent's work for things like DRY, SOLID, etc. After this work goes back to the implementer agent to complete the next section in the plan

The process continues until the whole plan is completed
```

CLI Prompt:

CLI has /agent instead of /create-agent:

/agent > Create new agent > Project > Create with Copilot
