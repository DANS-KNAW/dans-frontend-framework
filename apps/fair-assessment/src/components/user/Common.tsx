import { forwardRef, type ReactNode, type Dispatch, type SetStateAction } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import { MotionListItem, MotionList } from "../Animations";
import List from "@mui/material/List";
import Grid from "@mui/material/Unstable_Grid2";
import { AnimatePresence } from "framer-motion";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Pid, Obj, Collection } from "./api";

export function Notice({
  title,
  isSelected,
  onClick,
  children,
}: {
  title: string;
  isSelected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Alert severity="info" sx={{ mt: 1, '.MuiAlert-message': { flex: 1 } }}>
      <AlertTitle>{title}</AlertTitle>
      <Box>
        {children}
        <Button 
          variant="outlined" 
          sx={{ mt: 1, float: 'right' }} 
          disabled={isSelected}
          onClick={onClick}
        >
          {!isSelected ? "Add to selection" : "Selected"}
        </Button>
      </Box>
    </Alert>
  )
}

export function CardHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <Typography variant="h5" mb={1}>
        {title}
      </Typography>
      <Typography variant="body2" mb={1}>
        {subtitle}
      </Typography>
    </>
  );
}

export function TabPanel({ children, value, index }: { children: ReactNode, value: number, index: number }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

type SelectedItemProps = {
  item?: Obj | Pid;
  onClick: () => void;
  icon: ReactNode;
  type?: string;
  setItems?: Dispatch<SetStateAction<Obj[]>>; // optional, used for collections
} & React.ComponentProps<typeof MotionListItem>; // inherit all MotionListItem props

export const SelectedItem = forwardRef<HTMLLIElement, SelectedItemProps>(
  ({ item, onClick, icon, type, setItems, ...motionListItemProps }, ref) => {
  return (
    <>
      <MotionListItem
        key={item?.id || "loading"}
        disableGutters
        layout
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        ref={ref}
        {...motionListItemProps}
      >
        <ListItemButton onClick={onClick}>
          <ListItemAvatar>
            <Avatar>{icon}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={item?.name || item?.title || "Loading..."}
            secondary={type === "pid" ? `${item?.repository?.name}` : item?.id}
          />
        </ListItemButton>
      </MotionListItem>
      {type !== "pid" && (item as Obj)?.collections && (
        <MotionList 
          component="div" 
          disablePadding 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >

          <Typography variant="caption" display="block" gutterBottom  sx={{ pl: 9 }}>
            Select your collections:
          </Typography>
          
          {setItems && (item?.collections as Collection[]).map((collection) => {
            const labelId = `checkbox-list-label-${collection.name}`;

            return (
              <ListItemButton 
                role={undefined} 
                onClick={
                  () => {
                    const updatedCollection = { ...collection, enabled: !collection.enabled };
                    const updatedCollections = (item?.collections as Collection[])?.map((c) =>
                      c.name === collection.name ? updatedCollection : c
                    );
                    setItems((prevItems) =>
                      prevItems.map((i) =>
                        i.id === item?.id ? { ...i, collections: updatedCollections } : i
                      )
                    );
                  }
                } 
                dense
                key={collection.name}
                 sx={{ pl: 9 }}
              >
                <ListItemIcon sx={{ minWidth: 36, height: 16 }}>
                  <Checkbox
                    edge="start"
                    checked={collection.enabled}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={collection.name} />
              </ListItemButton>
            )}
          )}
        </MotionList>
      )}
    </>
  )
});

type BaseProps = {
  header: string;
  icon: ReactNode;
  emptyMessage: string;
};

type PidProps = BaseProps & {
  type: "pid";
  items: Pid[];
  setItems: Dispatch<SetStateAction<Pid[]>>;
};

type ObjProps = BaseProps & {
  type?: undefined; // optional or undefined
  items: Obj[];
  setItems: Dispatch<SetStateAction<Obj[]>>; 
};

type SelectedItemsProps = PidProps | ObjProps;

const rightListVariants = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
};

export function SelectedItems({
  header,
  icon,
  items,
  setItems,
  emptyMessage,
  type,
}: SelectedItemsProps) {
  const removeItem = (index: number) => {
    if (type === "pid") {
      const typedItems = items as Pid[];
      setItems(typedItems.filter((_, i) => i !== index));
    } else {
      const typedItems = items as Obj[];
      setItems(typedItems.filter((_, i) => i !== index));
    }
  };

  return (
    <Grid xs={12} md={6}>
      <Typography variant="h6">
        {header}
      </Typography>
      <List dense>
        <AnimatePresence initial={false} mode="popLayout">
          {items.length > 0 ? items.map((item, index) => 
            <SelectedItem
              key={item.id || item.identifier}
              item={item}
              icon={icon}
              onClick={() => window.open(item.url || item.identifier, "_blank")}
              setItems={item.collections && item.collections.length > 0 ? setItems as Dispatch<SetStateAction<Obj[]>> : undefined}
              variants={rightListVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              type={type}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => removeItem(index)}>
                  <DeleteIcon />
                </IconButton>
              }
            />
          ) :
            <MotionListItem key="empty" disableGutters variants={rightListVariants} initial="initial" animate="animate" exit="exit">
              <ListItemText primary={emptyMessage} />
            </MotionListItem>
          }
        </AnimatePresence>
      </List>
    </Grid>
  )
}