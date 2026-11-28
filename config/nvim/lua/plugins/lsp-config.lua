return {
	{
		"williamboman/mason.nvim",
		cmd = "Mason",
		opts = {},
	},
	{
		"williamboman/mason-lspconfig.nvim",
		lazy = true,
		dependencies = { "williamboman/mason.nvim" },
		opts = {
			ensure_installed = {
				"lua_ls",
				"ts_ls",
				"astro",
				"azure_pipelines_ls",
				"omnisharp",
				"tailwindcss",
				"html",
				"biome",
				"yamlls",
				"zls",
			},
		},
	},
	{
		"neovim/nvim-lspconfig",
		event = { "BufReadPre", "BufNewFile" },
		dependencies = {
			"hrsh7th/cmp-nvim-lsp",
			"williamboman/mason-lspconfig.nvim",
		},
		config = function()
			local cmp_nvim_lsp = require("cmp_nvim_lsp")
			local capabilities = vim.tbl_deep_extend(
				"force",
				{},
				vim.lsp.protocol.make_client_capabilities(),
				cmp_nvim_lsp.default_capabilities()
			)
			local mason_packages = vim.fn.stdpath("data") .. "/mason/packages"

			local server_configs = {
				ts_ls = {
					cmd = {
						mason_packages .. "/typescript-language-server/node_modules/.bin/typescript-language-server",
						"--stdio",
					},
				},
				tailwindcss = {
					cmd = {
						mason_packages .. "/tailwindcss-language-server/node_modules/.bin/tailwindcss-language-server",
						"--stdio",
					},
				},
			}

			local servers = {
				"lua_ls",
				"ts_ls",
				"astro",
				"azure_pipelines_ls",
				"omnisharp",
				"tailwindcss",
				"html",
				"biome",
				"yamlls",
				"zls",
				"nixd",
			}

			for _, server in ipairs(servers) do
				vim.lsp.config(
					server,
					vim.tbl_deep_extend("force", server_configs[server] or {}, {
						capabilities = capabilities,
					})
				)
			end

			vim.lsp.enable(servers)

			vim.api.nvim_create_autocmd("LspAttach", {
				callback = function(event)
					local map = function(keys, action, desc)
						vim.keymap.set("n", keys, action, { buffer = event.buf, desc = desc })
					end

					map("gh", vim.lsp.buf.hover, "LSP: hover documentation")
					map("gd", vim.lsp.buf.definition, "LSP: go to definition")
					map("gr", vim.lsp.buf.references, "LSP: find references")
					map("ga", vim.lsp.buf.code_action, "LSP: code action")
					map("<leader>d", vim.diagnostic.open_float, "Diagnostics: show line details")
					map("<leader>rn", vim.lsp.buf.rename, "LSP: rename symbol")
				end,
			})
		end,
	},
}
