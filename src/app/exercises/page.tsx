'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useExerciseList } from '@/hooks/use-exercises';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const difficultyColor: Record<string, string> = {
  Beginner: 'bg-green-500/10 text-green-500',
  Intermediate: 'bg-yellow-500/10 text-yellow-500',
  Advanced: 'bg-red-500/10 text-red-500',
  Expert: 'bg-purple-500/10 text-purple-500',
};

export default function ExerciseListPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useExerciseList({ search, per_page: 20 });

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-foreground'>
              Exercícios
            </h1>
            <p className='text-muted-foreground text-sm mt-1'>
              Gerencie o catálogo de exercícios
            </p>
          </div>
          <Link href='/exercises/new'>
            <Button>
              <Plus className='h-4 w-4 mr-2' />
              Novo Exercício
            </Button>
          </Link>
        </div>

        <div className='flex items-center gap-2'>
          <div className='relative flex-1 max-w-sm'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Buscar exercícios...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='pl-9'
            />
          </div>
        </div>

        <div className='rounded-lg border border-border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Dificuldade</TableHead>
                <TableHead>Grupo Muscular</TableHead>
                <TableHead>Grupo de Movimento</TableHead>
                <TableHead className='text-right'>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className='h-5 w-40' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-5 w-24' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-5 w-32' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-5 w-32' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-5 w-20 ml-auto' />
                    </TableCell>
                  </TableRow>
                ))
              ) : data?.data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className='text-center py-12 text-muted-foreground'
                  >
                    Nenhum exercício encontrado
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((exercise) => (
                  <TableRow key={exercise.id}>
                    <TableCell className='font-medium text-foreground'>
                      <div className='flex items-center gap-3'>
                        {exercise.gif_url ? (
                          <img
                            src={exercise.gif_url}
                            alt=''
                            className='h-10 w-10 rounded object-cover shrink-0'
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                'none';
                            }}
                          />
                        ) : (
                          <div className='h-10 w-10 rounded bg-muted shrink-0' />
                        )}
                        <Link
                          href={`/exercises/${exercise.id}`}
                          className='hover:text-primary transition-colors'
                        >
                          {exercise.name}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>
                      {exercise.difficulty ? (
                        <Badge
                          variant='secondary'
                          className={difficultyColor[exercise.difficulty]}
                        >
                          {exercise.difficulty}
                        </Badge>
                      ) : (
                        <span className='text-muted-foreground text-sm'>—</span>
                      )}
                    </TableCell>
                    <TableCell className='text-muted-foreground'>
                      {exercise.muscle_group.name}
                    </TableCell>
                    <TableCell className='text-muted-foreground'>
                      {exercise.movement_group.name}
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        <Link href={`/exercises/${exercise.id}/edit`}>
                          <Button variant='ghost' size='sm'>
                            Editar
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {data && (
          <div className='text-sm text-muted-foreground text-center'>
            {data.total} exercício{data.total !== 1 ? 's' : ''} encontrado
            {data.total !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

