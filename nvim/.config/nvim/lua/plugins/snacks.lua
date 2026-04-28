return {
	"folke/snacks.nvim",
	dependencies = {
		"echasnovski/mini.icons",
	},
	priority = 1000,
	lazy = false,
	opts = {
		bigfile = { enabled = true },
		dashboard = {
			enabled = true,
			preset = {
				header = [[
                                                                     
       ████ ██████           █████      ██                     
      ███████████             █████                             
      █████████ ███████████████████ ███   ███████████   
     █████████  ███    █████████████ █████ ██████████████   
    █████████ ██████████ █████████ █████ █████ ████ █████   
  ███████████ ███    ███ █████████ █████ █████ ████ █████  
 ██████  █████████████████████ ████ █████ █████ ████ ██████ 
        ]],
			},
		},
		indent = {
			enabled = true,
			scope = {
				treesitter = {
					injections = false,
				},
			},
		},
		input = { enabled = true },
		git = { enabled = true },
		picker = { enabled = true },
		notifier = { enabled = true },
		quickfile = { enabled = false },
		scroll = { enabled = false },
		statuscolumn = { enabled = true },
		words = { enabled = true },
	},
	keys = {
		{
			"<leader>sf",
			function()
				Snacks.scratch()
			end,
			desc = "Toggle Scratch Buffer",
		},
		{
			"<leader>S",
			function()
				Snacks.scratch.select()
			end,
			desc = "Select Scratch Buffer",
		},
		{
			"<leader>gl",
			function()
				Snacks.lazygit.log_file()
			end,
			desc = "Lazygit Log (cwd)",
		},
		{
			"<leader>lg",
			function()
				Snacks.lazygit()
			end,
			desc = "Lazygit",
		},
		{
			"<C-p>",
			function()
				Snacks.picker.pick("files")
			end,
			desc = "Find Files",
		},
		{
			"<leader><leader>",
			function()
				Snacks.picker.recent()
			end,
			desc = "Recent Files",
		},
		{
			"<leader>fb",
			function()
				Snacks.picker.buffers()
			end,
			desc = "Buffers",
		},
		{
			"<leader>fg",
			function()
				Snacks.picker.grep()
			end,
			desc = "Grep Files",
		},
		{
			"<leader>e",
			function()
				Snacks.explorer()
			end,
			desc = "Explorer",
		},
		{
			"<C-n>",
			function()
				Snacks.explorer()
			end,
			desc = "Explorer",
		},
	},
	config = function(_, opts)
		require("snacks").setup(opts)

		local group = vim.api.nvim_create_augroup("snacks_explorer_close_if_last", { clear = true })
		vim.api.nvim_create_autocmd("QuitPre", {
			group = group,
			callback = function()
				local snacks_windows = {}
				local floating_windows = {}
				local windows = vim.api.nvim_list_wins()

				for _, win in ipairs(windows) do
					local buf = vim.api.nvim_win_get_buf(win)
					local filetype = vim.api.nvim_get_option_value("filetype", { buf = buf })

					if filetype:match("snacks_") ~= nil then
						table.insert(snacks_windows, win)
					elseif vim.api.nvim_win_get_config(win).relative ~= "" then
						table.insert(floating_windows, win)
					end
				end

				if #windows - #floating_windows - #snacks_windows == 1 then
					for _, win in ipairs(snacks_windows) do
						vim.api.nvim_win_close(win, true)
					end
				end
			end,
		})
	end,
}
