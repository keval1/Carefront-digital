import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Plus,
  Mail,
  MessageSquare,
  Smartphone,
  Clock,
  Sparkles,
  CheckCircle2,
  Users,
  TrendingUp,
  Settings,
  DollarSign,
  ChevronRight,
  RefreshCw,
  Search,
  Move,
  Trash2,
  Copy,
  Zap,
  ShieldCheck,
  Send,
  Sliders,
  Check,
  X,
  Layers,
  ArrowRight
} from 'lucide-react';

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action_sms' | 'action_email' | 'action_whatsapp' | 'action_ai_qualification' | 'delay' | 'condition';
  title: string;
  subtitle: string;
  channel?: 'sms' | 'email' | 'whatsapp' | 'ai';
  content?: string;
  delayHours?: number;
  conditionLabel?: string;
  x: number;
  y: number;
  stats?: {
    sent: number;
    delivered: number;
    engaged: number;
    converted: number;
  };
}

export interface OutreachWorkflow {
  id: string;
  name: string;
  description: string;
  category: 'lead_qualification' | 'aftercare' | 'retention' | 'broadcast';
  status: 'active' | 'paused' | 'draft';
  triggerType: string;
  leadsProcessed: number;
  revenueGeneratedDollars: number;
  conversionRate: string;
  nodes: WorkflowNode[];
}

export const WORKFLOW_TEMPLATES: Array<{
  id: string;
  name: string;
  category: OutreachWorkflow['category'];
  description: string;
  triggerType: string;
  nodes: WorkflowNode[];
}> = [
  {
    id: 'tpl-meta-google-qualify',
    name: 'Meta & Google Ads Speed-to-Lead Triage',
    category: 'lead_qualification',
    description: 'Instantly triages inbound consultation requests from paid ads and organic forms within 15 seconds.',
    triggerType: 'Meta / Google Ad Form Submission',
    nodes: [
      {
        id: 'node-1',
        type: 'trigger',
        title: 'Ad Lead Form Submitted',
        subtitle: 'Meta Ads, Google Search & Website Consultation',
        x: 60,
        y: 120,
        stats: { sent: 342, delivered: 342, engaged: 342, converted: 342 }
      },
      {
        id: 'node-2',
        type: 'delay',
        title: 'Speed-to-Lead Delay',
        subtitle: 'Wait 15 seconds (anti-bot buffer)',
        delayHours: 0.005,
        x: 340,
        y: 120
      },
      {
        id: 'node-3',
        type: 'action_ai_qualification',
        title: 'AI Clinical Triage & Intake',
        subtitle: 'Qualifies procedure interest & contraindications',
        channel: 'ai',
        content: 'Checks prior neurotoxin history, pregnancy status, target areas, and budget range.',
        x: 620,
        y: 120,
        stats: { sent: 342, delivered: 338, engaged: 294, converted: 182 }
      },
      {
        id: 'node-4',
        type: 'action_sms',
        title: 'Priority SMS Reservation Invite',
        subtitle: 'Personalized physician calendar link with $50 deposit',
        channel: 'sms',
        content: 'Hi {{first_name}}, Dr. Sarah Jenkins reviewed your Morpheus8 inquiry. We have 2 VIP morning slots open this Thursday. Lock with $50 deposit: {{booking_url}}',
        x: 900,
        y: 120,
        stats: { sent: 182, delivered: 181, engaged: 146, converted: 119 }
      }
    ]
  },
  {
    id: 'tpl-post-care-morpheus',
    name: 'Morpheus8 & Laser Clinical Aftercare Protocol',
    category: 'aftercare',
    description: 'Automated 14-day post-procedure clinical instructions, healing check-ins, and review prompt.',
    triggerType: 'Appointment Status = Completed (EMR)',
    nodes: [
      {
        id: 'node-c1',
        type: 'trigger',
        title: 'Treatment Marked Complete',
        subtitle: 'Aesthetic Record EMR Quad-A checkout',
        x: 60,
        y: 120,
        stats: { sent: 188, delivered: 188, engaged: 188, converted: 188 }
      },
      {
        id: 'node-c2',
        type: 'action_sms',
        title: 'Day 0: Instant Post-Care Guide',
        subtitle: 'Ice protocol, SPF 50 rules & calming cream guide',
        channel: 'sms',
        content: 'Hi {{first_name}}, thank you for visiting Aura! Remember to avoid makeup for 24h and apply your SkinCeuticals repair cream. Tap for PDF: {{aftercare_url}}',
        x: 340,
        y: 120,
        stats: { sent: 188, delivered: 188, engaged: 172, converted: 165 }
      },
      {
        id: 'node-c3',
        type: 'delay',
        title: 'Wait 24 Hours',
        subtitle: 'Day 1 healing check-in buffer',
        delayHours: 24,
        x: 620,
        y: 120
      },
      {
        id: 'node-c4',
        type: 'action_whatsapp',
        title: 'Day 1: Recovery Photo Check-In',
        subtitle: 'Physician photo review for erythema & swelling',
        channel: 'whatsapp',
        content: 'Good morning {{first_name}}! Dr. Sarah wants to verify your healing progression. Please reply with a quick photo of your treated areas for our medical chart.',
        x: 900,
        y: 120,
        stats: { sent: 188, delivered: 186, engaged: 142, converted: 130 }
      }
    ]
  },
  {
    id: 'tpl-botox-90day-recall',
    name: 'Botox & Dysport 90-Day Neurotoxin Recall',
    category: 'retention',
    description: 'Predictive touch-up reminder timed with neurotoxin metabolic wearing-off curve.',
    triggerType: '75 Days Since Last Neuromodulator',
    nodes: [
      {
        id: 'node-r1',
        type: 'trigger',
        title: '75-Day Neurotoxin Milestone',
        subtitle: 'Automatic EMR treatment date trigger',
        x: 60,
        y: 120,
        stats: { sent: 276, delivered: 276, engaged: 276, converted: 276 }
      },
      {
        id: 'node-r2',
        type: 'action_email',
        title: 'Clinical Longevity Status Email',
        subtitle: 'Visual guide to neuromodulator maintenance',
        channel: 'email',
        content: 'Preserving Your Results: Why regular 90-day intervals maintain collagen tension and prevent deep dynamic lines.',
        x: 340,
        y: 120,
        stats: { sent: 276, delivered: 271, engaged: 198, converted: 112 }
      },
      {
        id: 'node-r3',
        type: 'delay',
        title: 'Wait 5 Days',
        subtitle: 'Day 80 follow-up buffer',
        delayHours: 120,
        x: 620,
        y: 120
      },
      {
        id: 'node-r4',
        type: 'action_sms',
        title: 'VIP Touch-Up SMS with Priority Slot',
        subtitle: 'One-tap deposit confirmation with favorite physician',
        channel: 'sms',
        content: 'Hi {{first_name}}, Nurse Olivia has reserved an exclusive Thursday touch-up slot for your Botox follow-up. Tap to confirm: {{vip_link}}',
        x: 900,
        y: 120,
        stats: { sent: 210, delivered: 209, engaged: 184, converted: 161 }
      }
    ]
  },
  {
    id: 'tpl-filler-touchup',
    name: 'Dermal Filler 6-Month Volume Maintenance',
    category: 'retention',
    description: 'Proactive hyaluronic acid volumizing check-in timed at 180 days post-injection.',
    triggerType: '180 Days Since Last Dermal Filler',
    nodes: [
      {
        id: 'node-f1',
        type: 'trigger',
        title: '6-Month Filler Milestone',
        subtitle: 'Aesthetic Record EMR injection log',
        x: 60,
        y: 120,
        stats: { sent: 142, delivered: 142, engaged: 142, converted: 142 }
      },
      {
        id: 'node-f2',
        type: 'action_sms',
        title: 'Mid-Year Lip & Cheek Assessment',
        subtitle: 'Complimentary 3D diagnostic scan invite',
        channel: 'sms',
        content: 'Hi {{first_name}}, it has been 6 months since your dermal contouring. We invite you for a complimentary Vectra 3D volume check: {{booking_url}}',
        x: 340,
        y: 120,
        stats: { sent: 142, delivered: 140, engaged: 98, converted: 74 }
      }
    ]
  }
];

const INITIAL_WORKFLOWS: OutreachWorkflow[] = [
  {
    id: 'wf-meta-google-qualify',
    name: 'Meta & Google Ads Speed-to-Lead Triage',
    description: 'Instantly triages inbound consultation requests from paid ads and organic forms within 15 seconds.',
    category: 'lead_qualification',
    status: 'active',
    triggerType: 'Meta / Google Ad Form Submission',
    leadsProcessed: 342,
    revenueGeneratedDollars: 84600,
    conversionRate: '34.8%',
    nodes: [
      {
        id: 'node-1',
        type: 'trigger',
        title: 'Ad Lead Form Submitted',
        subtitle: 'Meta Ads, Google Search & Website Consultation',
        x: 60,
        y: 120,
        stats: { sent: 342, delivered: 342, engaged: 342, converted: 342 }
      },
      {
        id: 'node-2',
        type: 'delay',
        title: 'Speed-to-Lead Delay',
        subtitle: 'Wait 15 seconds (anti-bot buffer)',
        delayHours: 0.005,
        x: 340,
        y: 120
      },
      {
        id: 'node-3',
        type: 'action_ai_qualification',
        title: 'AI Clinical Triage & Intake',
        subtitle: 'Qualifies procedure interest & contraindications',
        channel: 'ai',
        content: 'Checks prior neurotoxin history, pregnancy status, target areas, and budget range.',
        x: 620,
        y: 120,
        stats: { sent: 342, delivered: 338, engaged: 294, converted: 182 }
      },
      {
        id: 'node-4',
        type: 'action_sms',
        title: 'Priority SMS Reservation Invite',
        subtitle: 'Personalized physician calendar link with $50 deposit',
        channel: 'sms',
        content: 'Hi {{first_name}}, Dr. Sarah Jenkins reviewed your Morpheus8 inquiry. We have 2 VIP morning slots open this Thursday. Lock with $50 deposit: {{booking_url}}',
        x: 900,
        y: 120,
        stats: { sent: 182, delivered: 181, engaged: 146, converted: 119 }
      }
    ]
  },
  {
    id: 'wf-post-care-morpheus',
    name: 'Morpheus8 & Laser Clinical Aftercare Protocol',
    description: 'Automated 14-day post-procedure clinical instructions, healing check-ins, and review prompt.',
    category: 'aftercare',
    status: 'active',
    triggerType: 'Appointment Status = Completed (EMR)',
    leadsProcessed: 188,
    revenueGeneratedDollars: 42100,
    conversionRate: '41.2%',
    nodes: [
      {
        id: 'node-c1',
        type: 'trigger',
        title: 'Treatment Marked Complete',
        subtitle: 'Aesthetic Record EMR Quad-A checkout',
        x: 60,
        y: 120,
        stats: { sent: 188, delivered: 188, engaged: 188, converted: 188 }
      },
      {
        id: 'node-c2',
        type: 'action_sms',
        title: 'Day 0: Instant Post-Care Guide',
        subtitle: 'Ice protocol, SPF 50 rules & calming cream guide',
        channel: 'sms',
        content: 'Hi {{first_name}}, thank you for visiting Aura! Remember to avoid makeup for 24h and apply your repair cream every 4h. Tap for guide: {{aftercare_url}}',
        x: 340,
        y: 120,
        stats: { sent: 188, delivered: 188, engaged: 172, converted: 165 }
      },
      {
        id: 'node-c3',
        type: 'delay',
        title: 'Wait 24 Hours',
        subtitle: 'Day 1 healing check-in buffer',
        delayHours: 24,
        x: 620,
        y: 120
      },
      {
        id: 'node-c4',
        type: 'action_whatsapp',
        title: 'Day 1: Recovery Photo Check-In',
        subtitle: 'Physician photo review for erythema & swelling',
        channel: 'whatsapp',
        content: 'Good morning {{first_name}}! Dr. Sarah wants to verify your healing progression. Please reply with a quick photo of your treated areas for our medical chart.',
        x: 900,
        y: 120,
        stats: { sent: 188, delivered: 186, engaged: 142, converted: 130 }
      }
    ]
  },
  {
    id: 'wf-botox-90day-recall',
    name: 'Botox & Dysport 90-Day Neurotoxin Recall',
    description: 'Predictive touch-up reminder timed with neurotoxin metabolic wearing-off curve.',
    category: 'retention',
    status: 'active',
    triggerType: '75 Days Since Last Neuromodulator',
    leadsProcessed: 276,
    revenueGeneratedDollars: 118400,
    conversionRate: '58.3%',
    nodes: [
      {
        id: 'node-r1',
        type: 'trigger',
        title: '75-Day Neurotoxin Milestone',
        subtitle: 'Automatic EMR treatment date trigger',
        x: 60,
        y: 120,
        stats: { sent: 276, delivered: 276, engaged: 276, converted: 276 }
      },
      {
        id: 'node-r2',
        type: 'action_email',
        title: 'Clinical Longevity Status Email',
        subtitle: 'Visual guide to neuromodulator maintenance',
        channel: 'email',
        content: 'Preserving Your Results: Why regular 90-day intervals maintain collagen tension and prevent deep dynamic lines.',
        x: 340,
        y: 120,
        stats: { sent: 276, delivered: 271, engaged: 198, converted: 112 }
      },
      {
        id: 'node-r3',
        type: 'delay',
        title: 'Wait 5 Days',
        subtitle: 'Day 80 follow-up buffer',
        delayHours: 120,
        x: 620,
        y: 120
      },
      {
        id: 'node-r4',
        type: 'action_sms',
        title: 'VIP Touch-Up SMS with Priority Slot',
        subtitle: 'One-tap deposit confirmation with favorite physician',
        channel: 'sms',
        content: 'Hi {{first_name}}, Nurse Olivia has reserved an exclusive Thursday touch-up slot for your Botox follow-up. Tap to confirm: {{vip_link}}',
        x: 900,
        y: 120,
        stats: { sent: 210, delivered: 209, engaged: 184, converted: 161 }
      }
    ]
  }
];

interface OutreachAutomationsStudioProps {
  onToast: (msg: string) => void;
  activeMenuCategory?: string; // from AuraOSDashboard left menu: 'automations_canvas' | 'automations_lead_qualification' | 'automations_aftercare' | 'automations_retention'
}

export const OutreachAutomationsStudio: React.FC<OutreachAutomationsStudioProps> = ({
  onToast,
  activeMenuCategory = 'automations_canvas'
}) => {
  // Safe toast helper that defers toast notifications outside of React render phase
  const safeToast = (msg: string) => {
    setTimeout(() => {
      onToast?.(msg);
    }, 0);
  };

  const getInitialWorkflowId = () => {
    if (activeMenuCategory === 'automations_aftercare') return 'wf-post-care-morpheus';
    if (activeMenuCategory === 'automations_retention') return 'wf-botox-90day-recall';
    return 'wf-meta-google-qualify';
  };

  const getInitialNodeId = () => {
    if (activeMenuCategory === 'automations_aftercare') return 'node-c1';
    if (activeMenuCategory === 'automations_retention') return 'node-r1';
    return 'node-1';
  };

  const [workflows, setWorkflows] = useState<OutreachWorkflow[]>(INITIAL_WORKFLOWS);
  const [activeWorkflowId, setActiveWorkflowId] = useState<string>(getInitialWorkflowId);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(getInitialNodeId);
  const [canvasZoom, setCanvasZoom] = useState<number>(1);
  const [canvasOffset, setCanvasOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Individual Node Dragging State
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragNodeOffset, setDragNodeOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Template Modal State
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  // Simulation State with Subtle Step Animation
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatingStepIndex, setSimulatingStepIndex] = useState<number>(-1);
  const [simulatedPatient, setSimulatedPatient] = useState('Camilla Vance • (310) 844-1290');

  // Simulation timer refs for clean lifecycle management
  const simulationIntervalRef = React.useRef<any>(null);
  const simulationTimeoutRef = React.useRef<any>(null);

  useEffect(() => {
    return () => {
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
      if (simulationTimeoutRef.current) clearTimeout(simulationTimeoutRef.current);
    };
  }, []);

  // Sync active workflow if activeMenuCategory changes
  useEffect(() => {
    if (activeMenuCategory === 'automations_lead_qualification') {
      setActiveWorkflowId('wf-meta-google-qualify');
      setSelectedNodeId('node-1');
    } else if (activeMenuCategory === 'automations_aftercare') {
      setActiveWorkflowId('wf-post-care-morpheus');
      setSelectedNodeId('node-c1');
    } else if (activeMenuCategory === 'automations_retention') {
      setActiveWorkflowId('wf-botox-90day-recall');
      setSelectedNodeId('node-r1');
    }
  }, [activeMenuCategory]);

  const activeWf = workflows.find((w) => w.id === activeWorkflowId) || workflows[0];
  const selectedNode = activeWf.nodes.find((n) => n.id === selectedNodeId) || activeWf.nodes[0];

  const handleToggleWorkflowStatus = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const nextStatus = w.status === 'active' ? 'paused' : 'active';
          safeToast(`Workflow "${w.name}" is now ${nextStatus.toUpperCase()}`);
          return { ...w, status: nextStatus };
        }
        return w;
      })
    );
  };

  // Node Dragging Handlers
  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    setDraggingNodeId(nodeId);
    const node = activeWf.nodes.find((n) => n.id === nodeId);
    if (node) {
      setDragNodeOffset({
        x: (e.clientX - canvasOffset.x) / canvasZoom - node.x,
        y: (e.clientY - canvasOffset.y) / canvasZoom - node.y
      });
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.workflow-node')) return;
    setIsDraggingCanvas(true);
    setDragStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId) {
      const newX = Math.round((e.clientX - canvasOffset.x) / canvasZoom - dragNodeOffset.x);
      const newY = Math.round((e.clientY - canvasOffset.y) / canvasZoom - dragNodeOffset.y);
      setWorkflows((prev) =>
        prev.map((w) => {
          if (w.id === activeWorkflowId) {
            return {
              ...w,
              nodes: w.nodes.map((n) =>
                n.id === draggingNodeId
                  ? { ...n, x: Math.max(20, newX), y: Math.max(20, newY) }
                  : n
              )
            };
          }
          return w;
        })
      );
      return;
    }

    if (isDraggingCanvas) {
      setCanvasOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setDraggingNodeId(null);
    setIsDraggingCanvas(false);
  };

  // Auto-Arrange Nodes to prevent overlapping with optimal spacing
  const handleAutoArrange = () => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === activeWorkflowId) {
          return {
            ...w,
            nodes: w.nodes.map((n, idx) => ({
              ...n,
              x: 60 + idx * 300,
              y: 120
            }))
          };
        }
        return w;
      })
    );
    safeToast('✨ Auto-arranged canvas nodes with clean 300px spacing & zero overlaps.');
  };

  // Add Step to Canvas
  const handleAddNode = (type: WorkflowNode['type']) => {
    const maxX = Math.max(...activeWf.nodes.map((n) => n.x), 60);
    const stepCount = activeWf.nodes.length + 1;
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type,
      title:
        type === 'action_sms'
          ? 'SMS Priority Outreach'
          : type === 'action_whatsapp'
          ? 'WhatsApp Concierge'
          : type === 'action_email'
          ? 'Clinical Guidance Email'
          : type === 'action_ai_qualification'
          ? 'AI Clinical Triage'
          : type === 'delay'
          ? 'Time Buffer Delay'
          : 'Conditional Check',
      subtitle:
        type === 'delay' ? 'Wait 24 hours' : `Step ${stepCount} personalized communication`,
      channel:
        type === 'action_sms'
          ? 'sms'
          : type === 'action_whatsapp'
          ? 'whatsapp'
          : type === 'action_email'
          ? 'email'
          : type === 'action_ai_qualification'
          ? 'ai'
          : undefined,
      content: 'Hi {{first_name}}, Dr. Sarah Jenkins reviewed your procedure chart.',
      x: maxX + 280,
      y: 120,
      stats: { sent: 0, delivered: 0, engaged: 0, converted: 0 }
    };

    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === activeWorkflowId) {
          return { ...w, nodes: [...w.nodes, newNode] };
        }
        return w;
      })
    );
    setSelectedNodeId(newNode.id);
    safeToast(`Added Step ${stepCount} to canvas.`);
  };

  // Simulation Runner with Subtle Step Animation
  const handleStartSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulatingStepIndex(0);
    safeToast(`⚡ Running simulation for patient: ${simulatedPatient}`);

    if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
    if (simulationTimeoutRef.current) clearTimeout(simulationTimeoutRef.current);

    let currentStep = 0;
    simulationIntervalRef.current = setInterval(() => {
      currentStep++;
      if (currentStep < activeWf.nodes.length) {
        setSimulatingStepIndex(currentStep);
        const node = activeWf.nodes[currentStep];
        setSelectedNodeId(node.id);
      } else {
        if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
        simulationTimeoutRef.current = setTimeout(() => {
          setIsSimulating(false);
          setSimulatingStepIndex(-1);
          safeToast('✓ Simulation completed successfully! All clinical checks passed.');
        }, 1200);
      }
    }, 1600);
  };

  // Apply Template
  const handleApplyTemplate = (tpl: typeof WORKFLOW_TEMPLATES[0]) => {
    const newWf: OutreachWorkflow = {
      id: `wf-${Date.now()}`,
      name: tpl.name,
      description: tpl.description,
      category: tpl.category,
      status: 'active',
      triggerType: tpl.triggerType,
      leadsProcessed: 0,
      revenueGeneratedDollars: 0,
      conversionRate: '0.0%',
      nodes: JSON.parse(JSON.stringify(tpl.nodes))
    };

    setWorkflows((prev) => [newWf, ...prev]);
    setActiveWorkflowId(newWf.id);
    setSelectedNodeId(newWf.nodes[0]?.id || null);
    setIsTemplateModalOpen(false);
    safeToast(`Loaded template: "${tpl.name}" into canvas.`);
  };

  return (
    <div className="space-y-5 font-manrope">
      
      {/* Top Header & Page Standard (Clean, zero clutter, no tabs) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Outreach &amp; Lead Automations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Visual multi-channel canvas qualifying leads from Meta &amp; Google ads, post-treatment aftercare, and 90-day neurotoxin retention.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Templates Button */}
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>Workflow Templates</span>
          </button>

          {/* Simulate Outreach Button */}
          <button
            onClick={handleStartSimulation}
            disabled={isSimulating}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer ${
              isSimulating
                ? 'bg-blue-50 border-blue-300 text-blue-700 animate-pulse'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-blue-600" />
            <span>{isSimulating ? 'Simulating Steps...' : 'Simulate Outreach'}</span>
          </button>

          {/* Active / Pause Toggle */}
          <button
            onClick={() => handleToggleWorkflowStatus(activeWf.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer ${
              activeWf.status === 'active'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-800 hover:bg-slate-900 text-white'
            }`}
          >
            {activeWf.status === 'active' ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Active Workflow</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume Workflow</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Workflow Builder & Canvas Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col h-[700px]">
        
        {/* Canvas Toolbar Header */}
        <div className="p-3.5 border-b border-slate-200/80 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          
          {/* Left: Workflow Selector & Trigger Info */}
          <div className="flex items-center gap-3">
            <select
              value={activeWorkflowId}
              onChange={(e) => {
                setActiveWorkflowId(e.target.value);
                const nextWf = workflows.find((w) => w.id === e.target.value);
                if (nextWf) setSelectedNodeId(nextWf.nodes[0]?.id || null);
              }}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 shadow-2xs focus:outline-none"
            >
              {workflows.map((wf) => (
                <option key={wf.id} value={wf.id}>
                  {wf.name} ({wf.nodes.length} Steps)
                </option>
              ))}
            </select>

            <span className="text-[11px] text-slate-500 hidden md:inline">
              Trigger: <strong className="text-slate-700">{activeWf.triggerType}</strong>
            </span>
          </div>

          {/* Right: Auto-Arrange, Zoom, and Single Clean Add-Step Buttons */}
          <div className="flex items-center gap-2">
            
            {/* Auto-Arrange Button */}
            <button
              onClick={handleAutoArrange}
              className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
              title="Auto-arrange canvas nodes at proper distance with zero overlap"
            >
              <Move className="w-3 h-3 text-slate-500" />
              <span className="hidden sm:inline">Auto-Arrange</span>
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
              <button
                onClick={() => setCanvasZoom((z) => Math.max(0.6, z - 0.1))}
                className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 rounded cursor-pointer font-bold"
                title="Zoom Out"
              >
                -
              </button>
              <span className="text-[10px] font-mono font-bold px-1 text-slate-600">
                {Math.round(canvasZoom * 100)}%
              </span>
              <button
                onClick={() => setCanvasZoom((z) => Math.min(1.4, z + 0.1))}
                className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 rounded cursor-pointer font-bold"
                title="Zoom In"
              >
                +
              </button>
              <button
                onClick={() => {
                  setCanvasZoom(1);
                  setCanvasOffset({ x: 0, y: 0 });
                }}
                className="px-1.5 py-0.5 text-[10px] text-slate-500 hover:text-blue-600 font-semibold cursor-pointer"
                title="Reset View"
              >
                Reset
              </button>
            </div>

            {/* Single Clean Add-Step Buttons (No double plus icons!) */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleAddNode('action_sms')}
                className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                title="Add SMS step"
              >
                <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                <span>SMS</span>
              </button>

              <button
                onClick={() => handleAddNode('action_whatsapp')}
                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                title="Add WhatsApp step"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => handleAddNode('action_email')}
                className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                title="Add Email step"
              >
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <span>Email</span>
              </button>

              <button
                onClick={() => handleAddNode('action_ai_qualification')}
                className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                title="Add AI Qualification"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>AI Triage</span>
              </button>

              <button
                onClick={() => handleAddNode('delay')}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                title="Add Delay step"
              >
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Delay</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Simulation Progress Banner (When active) */}
        {isSimulating && (
          <div className="px-5 py-2.5 bg-blue-600 text-white text-xs flex items-center justify-between shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold">
                Simulation Running: Step {simulatingStepIndex + 1} of {activeWf.nodes.length} —{' '}
                {activeWf.nodes[simulatingStepIndex]?.title}
              </span>
            </div>
            <span className="text-[11px] text-blue-200 font-mono">Patient: {simulatedPatient}</span>
          </div>
        )}

        {/* Canvas Body: Left Drag/Pan Canvas + Right Step Inspector */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Movable & Draggable Interactive Canvas */}
          <div
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            className="flex-1 h-full overflow-hidden relative cursor-grab active:cursor-grabbing select-none bg-[#F8FAFC]"
            style={{
              backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          >
            {/* Movable Canvas Stage */}
            <div
              className="absolute inset-0 transition-transform duration-75"
              style={{
                transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${canvasZoom})`,
                transformOrigin: '0 0'
              }}
            >
              {/* Connecting Lines between Nodes */}
              <svg className="absolute inset-0 w-[3000px] h-[2000px] pointer-events-none">
                {activeWf.nodes.slice(0, -1).map((node, i) => {
                  const nextNode = activeWf.nodes[i + 1];
                  const startX = node.x + 240;
                  const startY = node.y + 75;
                  const endX = nextNode.x;
                  const endY = nextNode.y + 75;
                  const midX = (startX + endX) / 2;
                  const isCurrentActive = isSimulating && simulatingStepIndex === i;

                  return (
                    <g key={`line-${node.id}-${nextNode.id}`}>
                      <path
                        d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                        fill="none"
                        stroke={isCurrentActive ? '#2563EB' : '#94A3B8'}
                        strokeWidth={isCurrentActive ? '3.5' : '2.5'}
                        strokeDasharray={node.type === 'delay' ? '5,5' : 'none'}
                        className={isCurrentActive ? 'transition-all duration-300' : ''}
                      />
                      {/* Animated Pulse dot during simulation */}
                      {isCurrentActive && (
                        <circle
                          cx={midX}
                          cy={(startY + endY) / 2}
                          r="6"
                          fill="#2563EB"
                          className="animate-pulse"
                        />
                      )}
                      <circle cx={endX} cy={endY} r="4" fill="#2563EB" />
                    </g>
                  );
                })}
              </svg>

              {/* Render Individual Workflow Nodes (Draggable by user!) */}
              {activeWf.nodes.map((node, index) => {
                const isSelected = selectedNodeId === node.id;
                const isCurrentSim = isSimulating && simulatingStepIndex === index;

                return (
                  <div
                    key={node.id}
                    onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                    className={`workflow-node absolute w-64 rounded-2xl bg-white border shadow-md transition-shadow cursor-grab active:cursor-grabbing p-4 space-y-3 ${
                      isCurrentSim
                        ? 'border-blue-600 ring-4 ring-blue-500/25 shadow-2xl scale-[1.03] transition-transform duration-300'
                        : isSelected
                        ? 'border-blue-600 ring-4 ring-blue-500/15 shadow-xl'
                        : 'border-slate-200/90 hover:border-slate-400'
                    }`}
                    style={{
                      left: `${node.x}px`,
                      top: `${node.y}px`
                    }}
                  >
                    {/* Detailed Step Indicator Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
                            node.type === 'trigger'
                              ? 'bg-amber-100 text-amber-800'
                              : node.channel === 'sms'
                              ? 'bg-blue-100 text-blue-800'
                              : node.channel === 'whatsapp'
                              ? 'bg-emerald-100 text-emerald-800'
                              : node.channel === 'email'
                              ? 'bg-indigo-100 text-indigo-800'
                              : node.type === 'action_ai_qualification'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {node.type === 'trigger' ? (
                            <Zap className="w-3.5 h-3.5" />
                          ) : node.channel === 'sms' ? (
                            <Smartphone className="w-3.5 h-3.5" />
                          ) : node.channel === 'whatsapp' ? (
                            <MessageSquare className="w-3.5 h-3.5" />
                          ) : node.channel === 'email' ? (
                            <Mail className="w-3.5 h-3.5" />
                          ) : node.type === 'action_ai_qualification' ? (
                            <Sparkles className="w-3.5 h-3.5" />
                          ) : (
                            <Clock className="w-3.5 h-3.5" />
                          )}
                        </span>

                        <div>
                          <span className="font-extrabold text-[11px] text-slate-900 block leading-none">
                            Step {index + 1}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                            {node.type === 'trigger'
                              ? 'Trigger'
                              : node.type === 'delay'
                              ? 'Wait Buffer'
                              : node.channel || 'Action'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active Step" />
                        <span className="text-[10px] font-mono text-slate-400 font-semibold">
                          #{node.id.replace('node-', '')}
                        </span>
                      </div>
                    </div>

                    {/* Step Title & Subtitle */}
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 leading-snug">{node.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-tight">
                        {node.subtitle}
                      </p>
                    </div>

                    {/* Content Preview */}
                    {node.content && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[10px] text-slate-600 italic line-clamp-2 leading-relaxed">
                        "{node.content}"
                      </div>
                    )}

                    {/* Node Mini Delivery Stats */}
                    {node.stats && (
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>Dispatched: {node.stats.sent}</span>
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                          {Math.round((node.stats.converted / (node.stats.sent || 1)) * 100)}% Conv
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Inspector Drawer for Selected Node */}
          {selectedNode && (
            <div className="w-80 md:w-96 border-l border-slate-200/90 bg-white h-full flex flex-col justify-between overflow-y-auto p-5 text-xs text-slate-800 shadow-sm shrink-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-blue-600" />
                    <h3 className="font-extrabold text-sm text-slate-900">Step Inspector</h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">ID: {selectedNode.id}</span>
                </div>

                {/* Node Title Field */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Step Title</label>
                  <input
                    type="text"
                    value={selectedNode.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setWorkflows((prev) =>
                        prev.map((w) =>
                          w.id === activeWorkflowId
                            ? {
                                ...w,
                                nodes: w.nodes.map((n) =>
                                  n.id === selectedNode.id ? { ...n, title: val } : n
                                )
                              }
                            : w
                        )
                      );
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
                  />
                </div>

                {/* Node Subtitle Field */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Description / Subtext</label>
                  <input
                    type="text"
                    value={selectedNode.subtitle}
                    onChange={(e) => {
                      const val = e.target.value;
                      setWorkflows((prev) =>
                        prev.map((w) =>
                          w.id === activeWorkflowId
                            ? {
                                ...w,
                                nodes: w.nodes.map((n) =>
                                  n.id === selectedNode.id ? { ...n, subtitle: val } : n
                                )
                              }
                            : w
                        )
                      );
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                {/* Message Content & Smart EMR Tokens */}
                {selectedNode.content !== undefined && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-700 block">Outreach Message Copy</label>
                      <span className="text-[10px] text-blue-600 font-semibold cursor-pointer">
                        EMR Tokens Active
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      value={selectedNode.content}
                      onChange={(e) => {
                        const val = e.target.value;
                        setWorkflows((prev) =>
                          prev.map((w) =>
                            w.id === activeWorkflowId
                              ? {
                                  ...w,
                                  nodes: w.nodes.map((n) =>
                                    n.id === selectedNode.id ? { ...n, content: val } : n
                                  )
                                }
                              : w
                          )
                        );
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none leading-relaxed"
                    />

                    {/* Quick Insert Tokens */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {['{{first_name}}', '{{provider_name}}', '{{booking_url}}', '{{aftercare_url}}'].map(
                        (t) => (
                          <button
                            key={t}
                            onClick={() => {
                              const updatedContent = `${selectedNode.content || ''} ${t}`;
                              setWorkflows((prev) =>
                                prev.map((w) =>
                                  w.id === activeWorkflowId
                                    ? {
                                        ...w,
                                        nodes: w.nodes.map((n) =>
                                          n.id === selectedNode.id ? { ...n, content: updatedContent } : n
                                        )
                                      }
                                    : w
                                )
                              );
                                safeToast(`Inserted smart token ${t}`);
                            }}
                            className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg border border-blue-200 hover:bg-blue-100 cursor-pointer"
                          >
                            + {t}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Delay buffer field */}
                {selectedNode.type === 'delay' && (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Delay Duration (Hours)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.01"
                      value={selectedNode.delayHours || 24}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setWorkflows((prev) =>
                          prev.map((w) =>
                            w.id === activeWorkflowId
                              ? {
                                  ...w,
                                  nodes: w.nodes.map((n) =>
                                    n.id === selectedNode.id
                                      ? {
                                          ...n,
                                          delayHours: val,
                                          subtitle: `Wait ${val} hours before next touch`
                                        }
                                      : n
                                  )
                                }
                              : w
                          )
                        );
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800"
                    />
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (activeWf.nodes.length <= 1) {
                      safeToast('A workflow must maintain at least one step.');
                      return;
                    }
                    setWorkflows((prev) =>
                      prev.map((w) =>
                        w.id === activeWorkflowId
                          ? {
                              ...w,
                              nodes: w.nodes.filter((n) => n.id !== selectedNode.id)
                            }
                          : w
                      )
                    );
                    setSelectedNodeId(activeWf.nodes[0]?.id || null);
                    safeToast('Removed step from canvas.');
                  }}
                  className="text-rose-600 hover:text-rose-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Step</span>
                </button>

                <button
                  onClick={() => safeToast('Changes auto-saved to live outreach engine.')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Save Step
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Workflow Clinical Templates */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs font-manrope">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Select Clinical Workflow Template</h3>
                  <p className="text-xs text-slate-500">Curated high-converting templates for medical aesthetics</p>
                </div>
              </div>
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {WORKFLOW_TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  className="p-4 rounded-2xl border border-slate-200/90 hover:border-blue-500 hover:bg-blue-50/30 transition-all flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">{tpl.name}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {tpl.nodes.length} Steps
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{tpl.description}</p>
                    <div className="text-[10px] text-slate-400 font-mono pt-1">
                      Trigger: {tpl.triggerType}
                    </div>
                  </div>

                  <button
                    onClick={() => handleApplyTemplate(tpl)}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer shrink-0"
                  >
                    Load Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
