import { domToReact } from 'html-react-parser';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CheckIcon from '@mui/icons-material/Check';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';

// Utility functions
const isHeading = (name: string): name is 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' => 
  /^h[1-6]$/.test(name);

const isInternalLink = (href: string): boolean => href?.startsWith('/') ?? false;

const parseColSpan = (colspan?: string): number | undefined => 
  colspan ? parseInt(colspan, 10) : undefined;

const isEmptyText = (children: any[]): boolean => 
  children[0]?.type === 'text' && children[0]?.data?.trim().length === 0;

// Component creators
const createTypography = (variant: any, children: any[], paragraph = false) => (
  <Typography variant={variant} paragraph={paragraph} sx={{ color: 'inherit' }}>
    {domToReact(children, parseOptionsRichText)}
  </Typography>
);

const createLink = (attribs: any, children: any[]) => {
  const internal = isInternalLink(attribs.href);
  return (
    <Link 
      {...attribs}
      component={internal ? RouterLink : 'a'}
      target={internal ? '_self' : '_blank'}
    >
      {domToReact(children, parseOptionsRichText)}
    </Link>
  );
};

const createTableCell = (
  children: any[], 
  attribs: any, 
  component?: 'th',
  isHeader = false
) => {
  const colSpan = parseColSpan(attribs?.colspan);
  const isXMark = children[0]?.data === 'X';
  
  return (
    <TableCell 
      {...(component && { component })}
      {...(colSpan && { colSpan })}
      sx={{ 
        color: 'primary.main',
        ...(isHeader && {
          fontWeight: 'bold',
          opacity: isEmptyText(children) ? 0 : 1
        })
      }}
    >
      {isXMark ? <CheckIcon color="inherit" /> : domToReact(children, parseOptionsRichText)}
    </TableCell>
  );
};

// Main parser configuration
export const parseOptionsRichText = {
  replace: ({ name, children, attribs }: any) => {
    const elementMap: Record<string, () => JSX.Element | null> = {
      p: () => createTypography(undefined, children, true),
      a: () => createLink(attribs, children),
      table: () => (
        <TableContainer sx={{ mb: 2 }}>
          <Table sx={{ color: 'primary.main' }}>
            {domToReact(children, parseOptionsRichText)}
          </Table>
        </TableContainer>
      ),
      thead: () => <TableHead>{domToReact(children, parseOptionsRichText)}</TableHead>,
      tbody: () => <TableBody>{domToReact(children, parseOptionsRichText)}</TableBody>,
      tr: () => <TableRow>{domToReact(children, parseOptionsRichText)}</TableRow>,
      th: () => createTableCell(children, attribs, 'th', true),
      td: () => createTableCell(children, attribs),
    };

    // Handle headings
    if (isHeading(name)) {
      return createTypography(name, children);
    }

    // Handle other elements
    return elementMap[name]?.() ?? null;
  },
};