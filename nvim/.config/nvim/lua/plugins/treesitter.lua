return {
	"nvim-treesitter/nvim-treesitter",
	event = { "BufReadPost", "BufNewFile" },
	build = ":TSUpdate",
	opts = {
		auto_install = true,
		highlight = {
			enable = true,
			disable = { "markdown", "markdown_inline" },
		},
		indent = { enable = true },
	},
	config = function(_, opts)
		require("nvim-treesitter.configs").setup(opts)
		vim.api.nvim_create_autocmd("BufWinEnter", {
			pattern = { "*.md", "*.markdown" },
			callback = function(args)
				vim.treesitter.stop(args.buf)
			end,
		})
	end,
}
