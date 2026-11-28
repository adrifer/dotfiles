return {
	"numToStr/Comment.nvim",
	opts = {}, -- keep defaults so gc/gcc are available
	keys = {
		{ "<leader>k", "gcc", mode = "n", remap = true, desc = "Comment: toggle current line" },
		{ "<leader>k", "gc", mode = "x", remap = true, desc = "Comment: toggle selection" },
	},
}
