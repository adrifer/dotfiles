vim.g.mapleader = " "

vim.opt.expandtab = true
vim.opt.tabstop = 2
vim.opt.softtabstop = 2
vim.opt.shiftwidth = 2
vim.opt.number = true
vim.opt.relativenumber = true

vim.keymap.set("i", "jj", "<Esc>", { noremap = true, silent = true, desc = "Exit insert mode" })
vim.keymap.set("n", "<C-d>", "<C-d>zz", { noremap = true, silent = true, desc = "Scroll down and center" })
vim.keymap.set("n", "<C-u>", "<C-u>zz", { noremap = true, silent = true, desc = "Scroll up and center" })

vim.keymap.set({ "n", "v" }, "<leader>y", [["+y]], { desc = "Yank selection to system clipboard" })
vim.keymap.set("n", "<leader>Y", [["+Y]], { desc = "Yank line to system clipboard" })

vim.keymap.set({ "n", "v" }, "<leader>p", [["+p]], { desc = "Paste after from system clipboard" })
vim.keymap.set({ "n", "v" }, "<leader>P", [["+P]], { desc = "Paste before from system clipboard" })

-- In `nvim -d` sessions launched by Git difftool, make q exit the whole diff.
-- The mapping is buffer-local and only created for diff windows, so normal
-- buffers keep q's default macro-recording behavior.
local diff_keymaps = vim.api.nvim_create_augroup("DiffKeymaps", { clear = true })
vim.api.nvim_create_autocmd({ "VimEnter", "WinEnter", "BufWinEnter" }, {
	group = diff_keymaps,
	callback = function()
		if vim.wo.diff then
			vim.keymap.set("n", "q", function()
				if vim.wo.diff then
					vim.cmd("quitall")
				end
			end, { buffer = true, desc = "Quit diff tool" })
		end
	end,
})

if vim.fn.has("wsl") == 1 then
	local win_clip = "/mnt/c/Windows/System32/clip.exe"
	local win_paste = table.concat({
		"/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe",
		"-NoLogo",
		"-NoProfile",
		"-NonInteractive",
		"-Command",
		'[Console]::Out.Write((Get-Clipboard -Raw).ToString().Replace("`r", ""))',
	}, " ")

	vim.g.clipboard = {
		name = "WslClipboard",
		copy = {
			["+"] = win_clip,
			["*"] = win_clip,
		},
		paste = {
			["+"] = win_paste,
			["*"] = win_paste,
		},
		cache_enabled = 0,
	}
end
