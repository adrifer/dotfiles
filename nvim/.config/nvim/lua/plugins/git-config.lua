return {
	{
		"tpope/vim-fugitive",
		cmd = {
			"Git",
			"G",
			"Gdiffsplit",
			"Gread",
			"Gwrite",
			"Ggrep",
			"GMove",
			"GDelete",
		},
	},
	{
		"lewis6991/gitsigns.nvim",
		event = { "BufReadPre", "BufNewFile" },
		opts = {},
		keys = {
			{ "<leader>gp", "<cmd>Gitsigns preview_hunk<cr>", desc = "Preview git hunk" },
			{ "<leader>gt", "<cmd>Gitsigns toggle_current_line_blame<cr>", desc = "Toggle git blame" },
		},
	},
}
