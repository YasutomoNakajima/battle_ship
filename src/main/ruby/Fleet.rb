class Fleet

  attr_reader :id, :type, :hp, :bullet
  attr_accessor :x, :y

  def initialize(id, type, hp, bullet=3)
    @id = id
    @type = type
    @hp = hp
    @bullet = bullet
    @x = 0
    @y = 0
  end

  def hit
    return 1 if @hp<=0
    @hp -= 1
    if @hp<=0
      puts "#{@type} was destroyed."
      return true
    end
    return false
  end

  def attack
    return false if @bullet<=0
    @bullet -= 1
    if @bullet <= 0
      puts "#{@type} doesn't have a bullet anymore. "
    end
    return true
  end

end
