return {
  "numToStr/Comment.nvim",
  opts = {}, -- keep defaults so gc/gcc are available
  keys = {
    { "<leader>k", "gcc", mode = "n", remap = true, desc = "Toggle comment line" },
    { "<leader>k", "gc",  mode = "x", remap = true, desc = "Toggle comment selection" },
  },
}
