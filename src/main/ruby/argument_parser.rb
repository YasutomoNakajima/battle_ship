def argument_parse(arg)
  arg.chomp!
  arg.chop!
  args = arg.split('+')
  return args
end

class Array
  def to_i!
    self.map!(&:to_i)
  end
end

class String
  def parse
    return self.split("").to_i!
  end
end

def argument_perfect_parse(arg)
   return argument_parse(arg).map{|value| value.parse}
end