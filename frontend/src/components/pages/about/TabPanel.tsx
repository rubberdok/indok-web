type Props = {
  children?: React.ReactNode;
  index: string | number;
  value: string | number;
};

export const TabPanel: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
};
