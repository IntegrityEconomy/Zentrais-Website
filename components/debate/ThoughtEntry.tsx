'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useDebate } from '@/hooks/useDebate';
import { X } from 'lucide-react';

export function ThoughtEntry() {
  const router = useRouter();
  const { createTopic, loading } = useDebate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await createTopic(title, content, tagArray);
      router.push('/debate');
    } catch (error) {
      console.error('Error creating perspective:', error);
      alert('Failed to create perspective. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (title || content || tags) {
      if (confirm('Discard post? We can add post to draft.')) {
        router.push('/debate');
      }
    } else {
      router.push('/debate');
    }
  };

  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  const maxWords = 100;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Begin Perspective</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          className="rounded-full"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">What is your core statement?</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Start typing your thought, question, or claim..."
            required
            className="w-full"
            maxLength={200}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Elaborate on your perspective</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Describe your idea or question in detail..."
            required
            rows={8}
            className="w-full resize-none"
            maxLength={maxWords * 10} // Rough estimate
          />
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Your perspective will be analyzed using the Integrity model.</span>
            <span className={wordCount > maxWords ? 'text-red-500' : ''}>
              {wordCount} / {maxWords} words
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (separated by commas)</Label>
          <Input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. Technology, AI, Ethics"
            className="w-full"
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting || wordCount > maxWords || !title.trim() || !content.trim()}
            className="bg-primary text-white hover:bg-primary/90"
          >
            {isSubmitting ? 'Creating...' : 'Post Perspective'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
