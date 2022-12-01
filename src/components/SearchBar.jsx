
import SearchIcon from '@mui/icons-material/Search';
import { TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment'
export function SearchBar() {


    return (
        <div>
            <TextField variant='outlined' placeholder='search..'  InputProps={{

                endAdornment: (
                    <InputAdornment position="end">
                        <SearchIcon />
                    </InputAdornment>
                )
            }} />
        </div>
    )

}