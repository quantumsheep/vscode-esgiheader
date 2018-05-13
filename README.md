<img src="https://raw.githubusercontent.com/QuantumSheep/vscode-esgiheader/master/esgi.png" width=300>

# ESGI Header for VSCode

This extension helps you to add informations header to your files with the ASCII ESGI logo and update automatically the updated time and username.

# Example
```
/* ********************************************************************************************************* */
/*                                                                                                           */
/*                                                              :::::::::: ::::::::   :::::::: :::::::::::   */
/*   extension.js                                              :+:       :+:    :+: :+:    :+:    :+:        */
/*                                                            +:+       +:+        +:+           +:+         */
/*   By: QuantumSheep <nathanael.dmc@outlook.fr>             +#++:++#  +#++:++#++ :#:           +#+          */
/*                                                          +#+              +#+ +#+   +#+#    +#+           */
/*   Created: 2018/05/11 11:43:36 by QuantumSheep          #+#       #+#    #+# #+#    #+#    #+#            */
/*   Updated: 2018/05/13 22:09:51 by QuantumSheep         ########## ########   ######## ###########         */
/*                                                                                                           */
/* ********************************************************************************************************* */
```

# How to install in Visual Studio Code

Press `F1` and type `ext install esgiheader`.  
**OR**  
Go to extensions tab and search for `esgiheader`

# Usage
 - **macOS** : <kbd>⌘</kbd> + <kbd>⌥</kbd> + <kbd>H</kbd>
 - **Linux** / **Windows** : <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>H</kbd>

Every time the hotkeys are pushed the updated time and updated username will be updated automatically.

## Configuration

To define your header's username and email, you need to go to your [User Settings](https://code.visualstudio.com/docs/getstarted/settings) and change those values :

```json
{
  "esgiheader.username": "QuantumSheep",
  "esgiheader.email": "nathanael.dmc@outlook.fr"
}
```

# Informations
## ASCII font used
Aligator

## License
MIT