import Logo from 'logo.svg'; 

const Appicon = ({ color = "#000000", width = "24px", height = "24px" }) => (
  <Logo style={{ fill: color, width, height }} />
);

export default Appicon;
