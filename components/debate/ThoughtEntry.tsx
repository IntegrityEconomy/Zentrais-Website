'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function ThoughtEntry() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Aquí iría la lógica para crear la perspectiva
    // Por ahora, solo redirigimos a la lista de perspectivas
    try {
      // Simular creación de la perspectiva
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push('/debate');
    } catch (error) {
      console.error('Error creating perspective:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Título de la perspectiva</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Escribe un título claro y conciso..."
          required
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Contenido</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Describe tu idea o pregunta en detalle..."
          required
          rows={8}
          className="w-full resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Etiquetas (separadas por comas)</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="ej: tecnología, IA, ética"
          className="w-full"
        />
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-emerald-500 text-white hover:bg-emerald-400"
        >
          {isSubmitting ? 'Creando...' : 'Crear perspectiva'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/debate')}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}









