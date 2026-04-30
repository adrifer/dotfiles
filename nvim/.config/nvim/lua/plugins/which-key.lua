return {
	"folke/which-key.nvim",
	event = "VeryLazy",
	keys = {
		{
			"<leader>?",
			function()
				require("which-key").show({ global = false })
			end,
			desc = "Show buffer keymaps",
		},
	},
	opts = {
		preset = "modern",
		spec = {
			{ "<leader>g", group = "Git" },
			{ "<leader>s", group = "Scratch" },
			{ "<leader>f", group = "Find / Format" },
			{ "<leader>r", group = "Refactor / Rename" },
			{ "<leader>y", group = "Yank to clipboard" },
			{ "<leader>p", group = "Paste from clipboard" },
		},
	},
}
