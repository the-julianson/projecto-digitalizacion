import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function CustomTabPanel(props) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      data-cy={`simple-tab`}
      {...other}
    >
      {value === index && <Box sx={{p: 3}}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs(props) {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    setValue(props.activeTab);
  }, [props.activeTab]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const nth1StackStyle = {
    direction: "column",
    width: "30%",
    alignItems: "center",
    sx: {marginX: "auto", my: 4},
    spacing: 5,
  };

  return (
    <Box sx={{width: "100%"}}>
      <Box
        sx={{borderBottom: 1, borderColor: "divider", justifyContent: "center"}}
      >
        <Tabs
        
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="fullWidth"
        >
          {props.labels.map((aLabel, index) => (
            <Tab
              key={index}
              label={aLabel}
              {...a11yProps(index)}
              data-cy="tab-text"
            />
          ))}
        </Tabs>
      </Box>
      {props.labels.map((aLabel, index) => (
        <CustomTabPanel value={value} index={index} key={index}>
          {props.children[index]}
        </CustomTabPanel>
      ))}
    </Box>
  );
}
