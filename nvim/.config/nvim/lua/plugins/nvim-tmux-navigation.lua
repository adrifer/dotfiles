return {
	"alexghergh/nvim-tmux-navigation",
	keys = {
		{ "<C-h>" },
		{ "<C-j>" },
		{ "<C-k>" },
		{ "<C-l>" },
		{ "<C-\\>" },
		{ "<C-Space>" },
	},
	config = function()
		local nvim_tmux_nav = require("nvim-tmux-navigation")

		nvim_tmux_nav.setup({
			disable_when_zoomed = true,
		})

		vim.keymap.set("n", "<C-h>", nvim_tmux_nav.NvimTmuxNavigateLeft, { desc = "Window: move left" })
		vim.keymap.set("n", "<C-j>", nvim_tmux_nav.NvimTmuxNavigateDown, { desc = "Window: move down" })
		vim.keymap.set("n", "<C-k>", nvim_tmux_nav.NvimTmuxNavigateUp, { desc = "Window: move up" })
		vim.keymap.set("n", "<C-l>", nvim_tmux_nav.NvimTmuxNavigateRight, { desc = "Window: move right" })
		vim.keymap.set("n", "<C-\\>", nvim_tmux_nav.NvimTmuxNavigateLastActive, { desc = "Window: last active" })
		vim.keymap.set("n", "<C-Space>", nvim_tmux_nav.NvimTmuxNavigateNext, { desc = "Window: next" })
	end,
}
