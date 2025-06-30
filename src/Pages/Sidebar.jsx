import { Box, Drawer, List, Divider, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { useState } from "react";

export default function Sidebar({ open, toggleDrawer }) {
    const [deptOptions, setDeptOptions] = useState(false);
    const [batchOptions, setBatchOptions] = useState(false);
    const [userOptions, setUserOptions] = useState(false);

    const DrawerList = (
        <Box sx={{ width: 250 }} role="alert">
            <List>
                <ListItemButton sx={{ ":hover": { backgroundColor: 'transparent' } }} href="/dashboard">
                    <ListItem>
                        <ListItemText primary={<Typography variant="h6" fontWeight="bold"> Campus Sphere </Typography>} />
                    </ListItem>
                </ListItemButton>

                <Divider />
                {/* <ListItem disablePadding>
                    <ListItemButton href="/dashboard">
                        <ListItemText primary="Feature List" />
                    </ListItemButton >
                </ListItem> */}


                <ListItem disablePadding>
                    <ListItemButton onClick={() => setDeptOptions(prev => !prev)}>
                        <ListItemText primary="Department" />
                    </ListItemButton>
                </ListItem>

                {/* Nested items rendered conditionally */}
                {deptOptions && (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ pl: 4 }} href="/departments/create-dept">
                                <ListItemText primary="Create Department" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ pl: 4 }} href="/departments">
                                <ListItemText primary="Manage Department" />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}

                <ListItem disablePadding>
                    <ListItemButton onClick={() => setBatchOptions(prev => !prev)}>
                        <ListItemText primary="Batch" />
                    </ListItemButton>
                </ListItem>

                {batchOptions && (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ pl: 4 }} href="/batch/create-batch">
                                <ListItemText primary="Create Batch" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ pl: 4 }} href="/batch">
                                <ListItemText primary="Manage Batch" />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}

                <ListItem disablePadding>
                    <ListItemButton onClick={() => setUserOptions(prev => !prev)}>
                        <ListItemText primary="Users" />
                    </ListItemButton>
                </ListItem>

                {userOptions && (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ pl: 4 }} href="/create-user">
                                <ListItemText primary="Create User" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ pl: 4 }} href="/users">
                                <ListItemText primary="Manage Users" />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}
            </List>
        </Box>
    );

    return (
        <>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </>
    );
}
