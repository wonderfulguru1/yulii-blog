import React, { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';

const AuthExample: React.FC = () => {
  const { user, signIn, signUp, signInWithGoogle, logout } = useAuthContext();
  const { addDocument, getDocuments, data: posts } = useFirestore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn(email, password);
    if (result.success) {
      console.log('Signed in successfully');
    } else {
      console.error('Sign in failed:', result.error);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signUp(email, password);
    if (result.success) {
      console.log('Signed up successfully');
    } else {
      console.error('Sign up failed:', result.error);
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle();
    if (result.success) {
      console.log('Google sign in successful');
    } else {
      console.error('Google sign in failed:', result.error);
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      console.log('Logged out successfully');
    } else {
      console.error('Logout failed:', result.error);
    }
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const result = await addDocument('posts', {
      title: postTitle,
      content: postContent,
      authorId: user.uid,
      authorEmail: user.email
    });

    if (result.success) {
      console.log('Post added successfully');
      setPostTitle('');
      setPostContent('');
    } else {
      console.error('Failed to add post:', result.error);
    }
  };

  const handleGetPosts = async () => {
    const result = await getDocuments('posts');
    if (result.success) {
      console.log('Posts retrieved:', result.data);
    } else {
      console.error('Failed to get posts:', result.error);
    }
  };

  if (user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Welcome, {user.email}!</CardTitle>
          <CardDescription>You are signed in to Firebase</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Add a Post</h3>
            <form onSubmit={handleAddPost} className="space-y-2">
              <div>
                <Label htmlFor="postTitle">Title</Label>
                <Input
                  id="postTitle"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Post title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="postContent">Content</Label>
                <Input
                  id="postContent"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Post content"
                  required
                />
              </div>
              <Button type="submit" className="w-full">Add Post</Button>
            </form>
          </div>
          
          <div className="space-y-2">
            <Button onClick={handleGetPosts} variant="outline" className="w-full">
              Get Posts
            </Button>
            <Button onClick={handleLogout} variant="destructive" className="w-full">
              Sign Out
            </Button>
          </div>

          {posts && posts.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Posts ({posts.length})</h3>
              <div className="space-y-2">
                {posts.map((post: any) => (
                  <div key={post.id} className="p-2 border rounded">
                    <h4 className="font-medium">{post.title}</h4>
                    <p className="text-sm text-gray-600">{post.content}</p>
                    <p className="text-xs text-gray-400">By: {post.authorEmail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Firebase Authentication</CardTitle>
        <CardDescription>Sign in or create an account to continue</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSignIn} className="space-y-2">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="flex space-x-2">
            <Button type="submit" className="flex-1">Sign In</Button>
            <Button type="button" onClick={handleSignUp} variant="outline" className="flex-1">
              Sign Up
            </Button>
          </div>
        </form>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        
        <Button onClick={handleGoogleSignIn} variant="outline" className="w-full">
          Sign in with Google
        </Button>
      </CardContent>
    </Card>
  );
};

export default AuthExample;
