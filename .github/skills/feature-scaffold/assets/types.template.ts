// Replace {{FeatureName}} with your actual feature name (PascalCase)

export interface {{FeatureName}}Item {
  id: number;
  // TODO: add fields specific to this feature
}

export interface {{FeatureName}}State {
  data: {{FeatureName}}Item[];
  isLoading: boolean;
  error: string | null;
}
