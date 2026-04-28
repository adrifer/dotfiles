return {
	"WhoIsSethDaniel/mason-tool-installer.nvim",
	event = "VeryLazy",
	dependencies = {
		"williamboman/mason.nvim",
	},
	opts = {
		ensure_installed = {
			"stylua",
			"prettier",
			"eslint_d",
			"nixfmt",
			"csharpier",
		},
		auto_update = false,
		run_on_start = true,
		start_delay = 3000,
	},
}
