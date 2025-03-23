import { ColumnDef } from '@tanstack/react-table';
import { Exam } from './types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ChevronDown, 
  Eye, 
  Lock, 
  MoreVertical, 
  PencilLine, 
  Shield, 
  Users,
  Calendar
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

// We'll use any to make it more JSX-friendly while satisfying TypeScript
export const examColumns = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox 
        checked={
          table.getIsAllPageRowsSelected() || 
          (table.getIsSomePageRowsSelected() ? "indeterminate" : false)
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Exam name',
    cell: ({ row }) => (
      <div className="text-left font-medium">{row.getValue('name')}</div>
    ),
  },
  {
    accessorKey: 'key',
    header: 'Exam key',
    cell: ({ row }) => (
      <div className="text-left font-medium opacity-50">{row.getValue('key')}</div>
    ),
  },
  {
    accessorKey: 'created',
    header: ({ column }) => (
      <div className="flex items-center gap-1 cursor-pointer" onClick={() => column.toggleSorting()}>
        Created
        <ChevronDown className="ml-1 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span>{row.getValue('created')}</span>
      </div>
    ),
    sortingFn: "datetime",
  },
  {
    id: 'security',
    header: 'Access',
    cell: ({ row }) => {
      const exam = row.original;
      return (
        <div className="flex items-center space-x-1 justify-center">
          {exam.isLocked && (
            <div className="rounded-full bg-slate-800 p-1.5" title="Exam is locked">
              <Lock className="h-3.5 w-3.5 text-white" />
            </div>
          )}
          {exam.isRestricted && (
            <div className="rounded-full bg-slate-800 p-1.5" title="Access is restricted">
              <Shield className="h-3.5 w-3.5 text-white" />
            </div>
          )}
          {!exam.isRestricted && !exam.isLocked && (
            <div className="rounded-full border border-slate-200 p-1.5" title="No restrictions">
              <Shield className="h-3.5 w-3.5 text-slate-400" />
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status');
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={`status-indicator ${
              status === 'closed' ? 'status-closed' : 
              status === 'open' ? 'status-open' : 'status-partial'
            }`}>
              <span className={`mr-1.5 h-2 w-2 rounded-full ${
                status === 'closed' ? 'bg-exam-red' : 
                status === 'open' ? 'bg-exam-green' : 'bg-exam-blue'
              }`} />
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="animate-fade-in">
            <DropdownMenuItem className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-exam-green" />
              Open
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-exam-red" />
              Closed
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-exam-blue" />
              Partial
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const exam = row.original;
      
      return (
        <div className="flex items-center justify-end space-x-2">
          {exam.actions.canEdit && (
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100" title="Edit exam">
              <PencilLine className="h-4 w-4" />
            </Button>
          )}
          
          {exam.actions.canView && (
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100" title="View exam">
              <Eye className="h-4 w-4" />
            </Button>
          )}
          
          {exam.actions.canMonitor && (
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100" title="Monitor exam">
              <Users className="h-4 w-4" />
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="animate-fade-in">
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>Archive</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
