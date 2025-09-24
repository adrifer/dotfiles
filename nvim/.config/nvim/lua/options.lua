vim.cmd("set expandtab")
vim.cmd("set tabstop=2")
vim.cmd("set softtabstop=2")
vim.cmd("set shiftwidth=2")
vim.wo.number = true
vim.wo.relativenumber = true
vim.g.mapleader = " "

vim.keymap.set("i", "jj", "<Esc>", { noremap = true, silent = true })
vim.api.nvim_set_keymap('n', '<C-d>', '<C-d>zz', { noremap = true, silent = true })
vim.api.nvim_set_keymap('n', '<C-u>', '<C-u>zz', { noremap = true, silent = true })

vim.keymap.set({"n", "v"}, "<leader>y", [["+y]], {desc = "Yank to system clipboard"})
vim.keymap.set("n", "<leader>Y", [["+Y]], {desc = "Yank line to system clipboard"})

vim.keymap.set({"n", "v"}, "<leader>p", [["+p]], {desc = "Paste from system clipboard"})
vim.keymap.set({"n", "v"}, "<leader>P", [["+P]], {desc = "Paste before from system clipboard"})

if vim.fn.has('wsl') == 1 then
    local win_clip = '/mnt/c/Windows/System32/clip.exe'
    local win_paste = table.concat({
        '/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe',
        '-NoLogo',
        '-NoProfile',
        '-NonInteractive',
        '-Command',
        '[Console]::Out.Write((Get-Clipboard -Raw).ToString().Replace("`r", ""))',
    }, ' ')

    vim.g.clipboard = {
        name = 'WslClipboard',
        copy = {
            ['+'] = win_clip,
            ['*'] = win_clip,
        },
        paste = {
            ['+'] = win_paste,
            ['*'] = win_paste,
        },
        cache_enabled = 0,
    }
end
