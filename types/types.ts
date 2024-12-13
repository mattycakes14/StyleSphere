//TypeScript can detect the screen names and what params they take for navigate
export type RootStackParamList = {
  index: undefined;
  "(tabs)/sample": undefined;
};

export type RootParamList = {
  Message: undefined; // No parameters for Message screen
  Chat: { username: string }; // Chat screen expects a username parameter
};
