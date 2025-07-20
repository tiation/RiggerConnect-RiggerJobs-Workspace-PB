import { DashboardMetrics, AgentStatus } from '../types/Dashboard';

class DashboardServiceClass {
  private baseUrl = 'http://localhost:3001'; // This should come from config

  async getMetrics(): Promise<DashboardMetrics> {
    try {
      // In real app, this would be an API call
      // const response = await fetch(`${this.baseUrl}/api/dashboard/metrics`);
      // return response.json();
      
      // Mock data for now
      return {
        activeAgents: Math.floor(Math.random() * 5) + 10, // 10-15
        tasksCompleted: Math.floor(Math.random() * 1000) + 2500, // 2500-3500
        systemLoad: Math.floor(Math.random() * 40) + 50, // 50-90%
        errors: Math.floor(Math.random() * 5), // 0-4
      };
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      throw error;
    }
  }

  async getAgents(): Promise<AgentStatus[]> {
    try {
      // In real app, this would be an API call
      // const response = await fetch(`${this.baseUrl}/api/dashboard/agents`);
      // return response.json();

      // Mock data for now
      const agentTypes = [
        { name: 'DataProcessor', type: 'Analytics Agent' },
        { name: 'EmailBot', type: 'Communication Agent' },
        { name: 'JobMatcher', type: 'Matching Engine' },
        { name: 'ComplianceChecker', type: 'Compliance Agent' },
        { name: 'PaymentProcessor', type: 'Payment Agent' },
      ];

      return agentTypes.map((agent, index) => ({
        id: (index + 1).toString(),
        name: agent.name,
        type: agent.type,
        status: this.getRandomStatus(),
        cpu: Math.floor(Math.random() * 80) + 10, // 10-90%
        memory: Math.floor(Math.random() * 70) + 20, // 20-90%
        lastUpdate: new Date(),
      }));
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      throw error;
    }
  }

  async getAgentDetails(agentId: string): Promise<AgentStatus | null> {
    try {
      const agents = await this.getAgents();
      return agents.find(agent => agent.id === agentId) || null;
    } catch (error) {
      console.error('Failed to fetch agent details:', error);
      throw error;
    }
  }

  async restartAgent(agentId: string): Promise<boolean> {
    try {
      // In real app, this would be an API call
      // const response = await fetch(`${this.baseUrl}/api/dashboard/agents/${agentId}/restart`, {
      //   method: 'POST',
      // });
      // return response.ok;

      console.log(`Restarting agent ${agentId}`);
      return true;
    } catch (error) {
      console.error('Failed to restart agent:', error);
      throw error;
    }
  }

  async stopAgent(agentId: string): Promise<boolean> {
    try {
      // In real app, this would be an API call
      console.log(`Stopping agent ${agentId}`);
      return true;
    } catch (error) {
      console.error('Failed to stop agent:', error);
      throw error;
    }
  }

  // WebSocket connection for real-time updates
  connectRealTime(callback: (data: { metrics?: DashboardMetrics; agents?: AgentStatus[] }) => void) {
    // In real app, this would establish a WebSocket connection
    // const ws = new WebSocket(`ws://localhost:3001/dashboard`);
    // ws.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   callback(data);
    // };
    // return ws;

    // Mock real-time updates for demo
    const interval = setInterval(async () => {
      try {
        const metrics = await this.getMetrics();
        const agents = await this.getAgents();
        callback({ metrics, agents });
      } catch (error) {
        console.error('Real-time update failed:', error);
      }
    }, 10000); // Update every 10 seconds

    return {
      close: () => clearInterval(interval)
    };
  }

  private getRandomStatus(): AgentStatus['status'] {
    const statuses: AgentStatus['status'][] = ['running', 'running', 'running', 'warning', 'error'];
    const randomIndex = Math.floor(Math.random() * statuses.length);
    return statuses[randomIndex];
  }
}

export const DashboardService = new DashboardServiceClass();