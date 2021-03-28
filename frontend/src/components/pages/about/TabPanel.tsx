import { Typography } from "@material-ui/core";

type TabPanelProps = {
  children?: React.ReactNode;
  index: string | number;
  value: string | number;
};

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Typography variant="body1" paragraph>
          {children}
        </Typography>
      )}
    </div>
  );
};

export default TabPanel;
