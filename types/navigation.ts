import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  EditProfile: undefined;
  HelpCenter: undefined;
};

export type MainTabParamList = {
  Schedule: undefined;
  Attendance: undefined;
  Profile: undefined;
};
