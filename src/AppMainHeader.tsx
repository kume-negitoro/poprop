import React from 'react'
import styled from 'styled-components'

import {
    colors,
    IconButton,
    Grid,
    AppBar,
    Toolbar,
    Typography,
    MuiThemeProvider,
    createMuiTheme,
} from '@material-ui/core'
import { Save, SaveAlt, ExitToApp } from '@material-ui/icons'

const theme = createMuiTheme({
    palette: {
        primary: colors.blue,
        secondary: colors.lightBlue,
    },
})

export interface Props {
    onSave: () => void
    onExport: () => void
    onExit: () => void
}

export class AppMainHeader extends React.Component<Props> {
    public render(): JSX.Element {
        return (
            <div>
                <MuiThemeProvider theme={theme}>
                    <AppBar position="fixed">
                        <Toolbar>
                            <Grid
                                container
                                alignItems="center"
                                justify="space-between"
                            >
                                <Grid item>
                                    <IconButton onClick={this.props.onExit}>
                                        <ExitToApp />
                                    </IconButton>
                                </Grid>
                                <Grid item>
                                    <Typography>Poprop</Typography>
                                </Grid>
                                <Grid item>
                                    <Grid container>
                                        <Grid item>
                                            <IconButton
                                                onClick={this.props.onSave}
                                            >
                                                <Save />
                                            </IconButton>
                                        </Grid>
                                        <Grid item>
                                            <IconButton
                                                onClick={this.props.onExport}
                                            >
                                                <SaveAlt />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Toolbar>
                    </AppBar>
                </MuiThemeProvider>
            </div>
        )
    }
}
