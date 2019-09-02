import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
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
                        variant="outlined"
                        color="inherit"
                        onClick={() => setMode(1)}
                    >
                        <img className="ButtonImage" src={NewFile} />
                        新規プロジェクト
                    </Button>
                    <Button
                        className="MenuButton"
                        variant="outlined"
                        color="inherit"
                    >
                        <img className="ButtonImage" src={OpenFile} />
                        既存プロジェクト
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
