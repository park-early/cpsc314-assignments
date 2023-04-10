CPSC 314 A6  (Jan 2023)

NAME or NAMES: Parker Lee

If working in a group, briefly state the work done by each person.

COMMENTS:

Please add any comments that you wish to pass on to the graders or instructor.


Creative Component:
- Added a third ray bounce that can be toggled via keybindings
- Added a specular lighting component to localShade that can also be toggled via keybindings


Keybindings:
1: Sets number of ray bounces to 1
2: Sets number of ray bounces to 2
3: Toggle on/off specular lighting (may take a couple key presses to work)
Space: Toggle on/off animation





Answer for part (a):

- Fragment shader starts with main()

- main() makes a call to initialize() which creates and places the 4 spheres into the scene
    - Sphere 0 is the light source (that can be controlled to move) and sphere 3 is the animated sphere

- main() also makes a call to rayCast()
    - rayCast() makes a call to nearestT()
        - nearestT() makes a call to sphere_intersect()

    - rayCast() makes a call to bgColor()
        - bgColor() makes a call to nearestT()
            - nearestT() makes a call to sphere_intersect()

    - rayCast() will need to make a call to rayCast2()
        - rayCast2() will need to make a call to bgColor()
            - bgColor() makes a call to nearestT()
                - nearestT() makes a call to sphere_intersect()

    - rayCast() may call localShade()
