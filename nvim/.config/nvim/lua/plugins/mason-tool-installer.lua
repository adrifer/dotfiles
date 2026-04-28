return {
	"WhoIsSethDaniel/mason-tool-installer.nvim",
	lazy = false,
	dependencies = {
		"williamboman/mason.nvim",
	},
	config = function()
		local mason_tool_installer = require("mason-tool-installer")

		mason_tool_installer.setup({
			ensure_installed = {
				"stylua",
				"prettier",
				"eslint_d",
				"nixfmt",
				"csharpier",
			},
			auto_update = false,
			run_on_start = true,
			start_delay = 0,
		})

		vim.api.nvim_create_autocmd("VimEnter", {
			group = vim.api.nvim_create_augroup("mason_tools_force_install", { clear = true }),
			once = true,
			callback = function()
				mason_tool_installer.check_install(false)
			end,
		})
	end,
}
