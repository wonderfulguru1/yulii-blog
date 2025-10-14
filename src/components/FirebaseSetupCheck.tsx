import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';

const FirebaseSetupCheck: React.FC = () => {
  const [checks, setChecks] = useState({
    apiKey: false,
    projectId: false,
    authDomain: false,
    appId: false,
    allLoaded: false
  });

  useEffect(() => {
    // Check if environment variables are loaded
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
    const appId = import.meta.env.VITE_FIREBASE_APP_ID;

    setChecks({
      apiKey: !!apiKey && apiKey !== 'your_api_key_here',
      projectId: !!projectId && projectId !== 'your_project_id',
      authDomain: !!authDomain && authDomain !== 'your_project_id.firebaseapp.com',
      appId: !!appId && appId !== 'your_app_id',
      allLoaded: !!(apiKey && projectId && authDomain && appId)
    });
  }, []);

  const getStatusIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  const getStatusColor = (isValid: boolean) => {
    return isValid ? 'text-green-600' : 'text-red-600';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Firebase Setup Check
        </CardTitle>
        <CardDescription>
          Verify your Firebase configuration is properly set up
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(checks.apiKey)}
              <span className={getStatusColor(checks.apiKey)}>
                API Key Configuration
              </span>
            </div>
            {!checks.apiKey && (
              <span className="text-sm text-muted-foreground">
                Check .env.local file
              </span>
            )}
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(checks.projectId)}
              <span className={getStatusColor(checks.projectId)}>
                Project ID Configuration
              </span>
            </div>
            {!checks.projectId && (
              <span className="text-sm text-muted-foreground">
                Check .env.local file
              </span>
            )}
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(checks.authDomain)}
              <span className={getStatusColor(checks.authDomain)}>
                Auth Domain Configuration
              </span>
            </div>
            {!checks.authDomain && (
              <span className="text-sm text-muted-foreground">
                Check .env.local file
              </span>
            )}
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(checks.appId)}
              <span className={getStatusColor(checks.appId)}>
                App ID Configuration
              </span>
            </div>
            {!checks.appId && (
              <span className="text-sm text-muted-foreground">
                Check .env.local file
              </span>
            )}
          </div>
        </div>

        {!checks.allLoaded && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Configuration Issue:</strong> Some Firebase environment variables are missing or using placeholder values. 
              Please update your <code>.env.local</code> file with your actual Firebase configuration.
            </AlertDescription>
          </Alert>
        )}

        {checks.allLoaded && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Configuration Complete:</strong> All Firebase environment variables are properly configured. 
              If you're still getting authentication errors, make sure to enable Email/Password and Google sign-in methods in your Firebase Console.
            </AlertDescription>
          </Alert>
        )}

        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-2">Next Steps:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
            <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
              Firebase Console <ExternalLink className="h-3 w-3" />
            </a></li>
            <li>Select your project</li>
            <li>Go to Authentication → Sign-in method</li>
            <li>Enable "Email/Password" authentication</li>
            <li>Enable "Google" authentication</li>
            <li>Save your changes</li>
          </ol>
        </div>

        <Button 
          onClick={() => window.location.reload()} 
          className="w-full"
        >
          Refresh Check
        </Button>
      </CardContent>
    </Card>
  );
};

export default FirebaseSetupCheck;
