import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import './SelectMenu.css'
import Close from '@material-ui/icons/Close'
import Check from '@material-ui/icons/Check'
import NewFile from './Fplus.svg'
import OpenFile from './Fopen.svg'

const SelectMenu: React.FC = (): JSX.Element => {
    const [mode, setMode] = useState(0)

    return (
        <div>
            {mode == 0 && (
                <div>
                    <Button
                        className="MenuButton"
                        variant="text"
                        color="inherit"
                        onClick={() => setMode(1)}
                    >
                        <Box textAlign="center">
                            <img className="ButtonImage" src={NewFile} />
                            <p>新規プロジェクト</p>
                        </Box>
                    </Button>
                    <Button
                        className="MenuButton"
                        variant="text"
                        color="inherit"
                    >
                        <Box textAlign="center">
                            <img className="ButtonImage" src={OpenFile} />
                            <p>既存プロジェクト</p>
                        </Box>
                    </Button>
                </div>
            )}
            {mode == 1 && (
                <Card>
                    <CardContent>
                        <TextField
                            className="FileName"
                            label="プロジェクト名"
                        />
                        <Button>保存先</Button>
                    </CardContent>
                    <CardActions className="CardButton">
                        <IconButton color="primary">
                            <Check />
                        </IconButton>
                        <IconButton color="inherit" onClick={() => setMode(0)}>
                            <Close />
                        </IconButton>
                    </CardActions>
                </Card>
            )}
        </div>
    )
}

export default SelectMenu
