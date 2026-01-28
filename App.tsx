
import React from 'react';
import { Layout } from './components/Layout';
import { ProjectProvider } from './contexts/ProjectContext';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ProjectProvider>
        <Layout />
      </ProjectProvider>
    </AuthProvider>
  );
};

export default App;
