import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Database, CheckCircle, AlertCircle } from 'lucide-react';
import { seedDatabase, checkIfSeeded } from '../utils/seedDatabase';

const SeedDatabase: React.FC = () => {
  const [isSeeded, setIsSeeded] = useState<boolean | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingResult, setSeedingResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    try {
      const seeded = await checkIfSeeded();
      setIsSeeded(seeded);
    } catch (error) {
      console.error('Error checking database status:', error);
      setIsSeeded(false);
    }
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setSeedingResult(null);

    try {
      const result = await seedDatabase();
      
      if (result.success) {
        setSeedingResult({
          success: true,
          message: result.message || 'Database seeded successfully! Blog posts have been added.'
        });
        setIsSeeded(true);
        // Refresh the page to show the new posts
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setSeedingResult({
          success: false,
          message: result.error || 'Failed to seed database. Please try again.'
        });
      }
    } catch (error: any) {
      setSeedingResult({
        success: false,
        message: error.message || 'An error occurred while seeding the database.'
      });
    } finally {
      setIsSeeding(false);
    }
  };

  if (isSeeded === null) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2">Checking database status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Setup
        </CardTitle>
        <CardDescription>
          Initialize your blog with sample content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isSeeded ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Database is already seeded with blog posts. You can start creating new posts or edit existing ones.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your database is empty. Click the button below to add sample blog posts to get started.
              </AlertDescription>
            </Alert>

            {seedingResult && (
              <Alert variant={seedingResult.success ? "default" : "destructive"}>
                <AlertDescription>{seedingResult.message}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleSeedDatabase} 
              disabled={isSeeding}
              className="w-full"
            >
              {isSeeding ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Seeding Database...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Add Sample Blog Posts
                </>
              )}
            </Button>

            <p className="text-sm text-muted-foreground">
              This will add 8 sample blog posts to your database, including both published and draft posts.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SeedDatabase;
