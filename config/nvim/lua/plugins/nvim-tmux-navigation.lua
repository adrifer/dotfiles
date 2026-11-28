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

		local function is_herdr()
			return vim.env.HERDR_PANE_ID ~= nil and vim.env.HERDR_PANE_ID ~= ""
		end

		local function herdr_bin()
			if vim.env.HERDR_BIN_PATH ~= nil and vim.env.HERDR_BIN_PATH ~= "" then
				return vim.env.HERDR_BIN_PATH
			end

			return "herdr"
		end

		local function herdr_navigate(wincmd, direction)
			local previous = vim.api.nvim_get_current_win()
			vim.cmd.wincmd(wincmd)

			if vim.api.nvim_get_current_win() ~= previous then
				return
			end

			vim.fn.system({ herdr_bin(), "pane", "focus", "--direction", direction, "--current" })
		end

		local function navigate(wincmd, direction, tmux_navigate)
			if is_herdr() then
				herdr_navigate(wincmd, direction)
				return
			end

			tmux_navigate()
		end

		vim.keymap.set("n", "<C-h>", function()
			navigate("h", "left", nvim_tmux_nav.NvimTmuxNavigateLeft)
		end, { desc = "Window: move left" })
		vim.keymap.set("n", "<C-j>", function()
			navigate("j", "down", nvim_tmux_nav.NvimTmuxNavigateDown)
		end, { desc = "Window: move down" })
		vim.keymap.set("n", "<C-k>", function()
			navigate("k", "up", nvim_tmux_nav.NvimTmuxNavigateUp)
		end, { desc = "Window: move up" })
		vim.keymap.set("n", "<C-l>", function()
			navigate("l", "right", nvim_tmux_nav.NvimTmuxNavigateRight)
		end, { desc = "Window: move right" })
		vim.keymap.set("n", "<C-\\>", nvim_tmux_nav.NvimTmuxNavigateLastActive, { desc = "Window: last active" })
		vim.keymap.set("n", "<C-Space>", nvim_tmux_nav.NvimTmuxNavigateNext, { desc = "Window: next" })
	end,
}
