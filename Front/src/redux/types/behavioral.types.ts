export interface Behavioral {
    abilityLabel: string;
    abilityLabelId: string;
    groupId: string;
    groupNum: string;
    info: string;
  }
  
  export interface BehavioralState {
    abilities: Behavioral[];
    selectedAbility: Behavioral | null;
    previewUrl: string | null;
    isLoading: boolean;
    isRecording: boolean;
    remainingTime: number;
  }
  